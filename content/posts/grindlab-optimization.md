---
slug: grindlab-optimization
title: "Design Diaries: Optimization"
date: September 4, 2025
excerpt: "Learning to respect mobile constraints. Optimization in GrindLab wasn't about brute force—it was about learning when to do less, smarter."
categories: ["Design", "Engineering"]
---

I knew I was facing an uphill battle when I began designing the coffee analysis engine in **GrindLab**. How do you run sophisticated particle analysis algorithms, often run by powerful desktop hardware, on a power-constrained iPhone? In my [previous post](https://www.nateking.dev/blog/start-your-engines), I briefly mentioned that my first implementation took fifteen minutes to process a single high-resolution image on an iPhone 15 Pro. This is the story of how I optimized a complex image processing pipeline to run smoothly on mobile hardware.

The idea that immediately came to mind was to simply downsample the image. It seemed elegant—halving the vertical and horizontal dimensions would result in one-quarter of the original pixels to process. My first test revealed two fundamental problems with the approach. Coffee grounds at espresso fineness can be as small as 200 microns. Even at full resolution these particles often only consist of a few pixels. Downsample too aggressively, and these particles vanish entirely. Processing an image at a different resolution it is displayed at created enormous complexity when trying to map the particles back over the original image shown in the user interface. I needed to stop and completely rethink my approach.

## Setting the Foundation

The single biggest win came from abandoning UIKit's comfortable abstractions. Instead of working with `UIImage` objects and per-pixel operations, I switched to raw, contiguous grayscale buffers `([UInt8])`. This eliminated the overhead of repeated UIImage/CIImage conversions and color space transformations:

``` swift
// Before: Expensive per-pixel UIKit operations
for pixel in image.pixels {
    let color = pixel.getColor()
    // Process...
}

// After: Direct buffer manipulation
withUnsafeMutableBufferPointer { buffer in
    for i in stride(from: 0, to: pixelCount, by: 4) {
        // Process 4 pixels at once
    }
}
```

Apple's [Accelerate framework](https://developer.apple.com/documentation/accelerate), particularly vImage, became my secret weapon. These APIs leverage SIMD instructions and are hand-optimized for Apple Silicon. I replaced every computationally intensive loop with its vImage equivalent:

- **Thresholding:** `vImageThreshold_*` replaced nested loops required for adaptive thresholding
- **Morphology:** `vImageDilate`/`vImageErode` for separating touching particles
- **Histograms:** `vDSP` for statistical analysis

The morphology changes were particularly transformative. Separating clumps—essential for accurate particle sizing—became nearly four times faster.

## The Art of Doing Less

Not all pixels in an image are equal. After initial preprocessing, I implemented region-of-interest cropping to focus only on the area containing coffee. If coffee grounds only occupy 60% of the image, I could immediately remove 40% from _all downstream computation._

I also adopted a progressive filtering strategy. Immediate noise rejection and particle quality checks ensure that the computationally expensive downstream processes like convex hull and advanced shape descriptors are only completed for promising candidates.

## The Parallelization Trap and Synchronization Tax

One of the most seductive optimization strategies in modern programming is parallelization. With iPhones sporting 6-8 CPU cores, it seems obvious: spread the work across all cores and watch your code fly, right? Not so fast. Let me share a cautionary tale from optimizing GrindLab's particle detection that perfectly illustrates why parallelization often creates more problems than it solves.

When I profiled my particle detection algorithm, I saw that 60% of the time was spent flood-filling regions to identify individual coffee particles. The algorithm visits every pixel, checking if it belongs to a particle, and if so, which particle. With a 12MP image, that's millions of pixels to check.

My first instinct was to divide the image into quadrants, assign each to a thread, and reap a 4x speed improvement. Here's what it looked like in simplified form:

``` swift
// The "obvious" parallel approach
let tileCount = ProcessInfo.processInfo.activeProcessorCount
DispatchQueue.concurrentPerform(iterations: tileCount) { tileIndex in
    let tileRange = getTileRange(for: tileIndex)
    
    for pixel in tileRange {
        if isParticle(pixel) {
            assignToCluster(pixel)
        }
    }
}
```

Numerous bugs appeared on the first test. When a particle straddled the boundary between two tiles, both threads would attempt to claim it. Now, I had dozens of single coffee particles with multiple particle IDs and no clear method of deduplication.

My second iteration added synchronization and particle locking. The duplicate particles disappeared, but so did my performance. The multi-thread synchronization and particle locks became a bottleneck, and threads spent more time waiting than processing particles.

Attempting to reduce particle contention led to even more complexity. Now, each thread needed its own data structures:

``` swift
struct ThreadContext {
    var localLabels: [Int: Int]  // Local label mapping
    var visitedPixels: Set<Int>  // Track what we've seen
    var borderPixels: [(pixel: Int, label: Int)]  // Particles at tile edges
    var localParticleData: [ParticleInfo]  // Temporary particle storage
}

// Merge phase
func mergeThreadResults(_ contexts: [ThreadContext]) {
    // Reconcile different labels for the same particle
    // Merge particles that span tile boundaries
    // Resolve conflicts in visited pixels
    // Combine particle statistics
    // ... 200 lines of complex merge logic
}
```

The logic required to merge particles became more complex than the original single-threaded algorithm. Debugging was a nightmare—particles would randomly merge or split depending on the particular thread scheduling of each run.

My solution for particle detection is to keep it single-threaded but optimize the algorithm itself. This included implementing a path/cost-based separator, but most importantly, limiting its use to a small set of "suspicious" components (large area, low circularity, multi-modal local histogram).

## The Wisdom of Selective Parallelization

This doesn't mean parallelization is always wrong. In GrindLab, I successfully parallelize independent row operations and per-particle measurements as these have no shared state.

The key is recognizing when parallelization's complexity cost exceeds its performance benefit. For connected components labeling—where every pixel potentially affects every other pixel—the interdependencies make parallelization a poor fit.

The journey from barely functional to performant required rethinking my assumptions about how image processing should work on mobile. In the end, optimization is as much about strategy as it is about code. Every decision felt less like chasing speed and more about clarifying and distilling the problem. I learned to respect the constraints of mobile hardware and design within them. Sometimes, the most powerful optimizations aren't the ones that push harder, but the ones that know when to take a step back.