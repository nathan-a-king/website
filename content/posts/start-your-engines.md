---
slug: start-your-engines
title: "Design Diaries: Start Your Engines"
date: August 31, 2025
excerpt: "A strong foundation is what turns ideas into tools people trust. Ask yourself: what is the one thing this product absolutely has to get right? Start there. Build around that."
category: "Engineering"
---

My mind filled with possibilities as I stared at a blank Xcode project that would later become **GrindLab.** It's difficult to find a point of focus in the early stages of any project. Spreading attention across too many features early almost guarantees burnout. My strategy to combat this is ruthlessly defining a *minimum viable product* (MVP) before writing a single line of code. What is the smallest unit of work that provides a valuable product for users? My app's fundamental reason for existing is to analyze coffee grounds. It simply can't succeed if it can't do that reliably. Thinking about this clarified my starting point—my app needs a reliable analysis engine.

A pile of grounds is just noise to a computer—dark flecks scattered against a background. To move beyond guesswork, I had to find a way to implement computer vision and image processing within the confines of a power-limited mobile device. At a fundamental level, I had to teach my app how to differentiate between *coffee* and *not coffee.* The first version leaned on a simple Otsu threshold: a well-known way of deciding which pixels are "dark enough" to count as grounds. It worked fine for synthetic tests but fell apart in the real world, where background lighting, shadows, and the chaotic nature of coffee created far too many false positives.

Eventually, I implemented blue-channel extraction. Coffee reflects very little blue light, so isolating the color gave me a clear contrast between coffee grounds and the background.

```swift
private func extractBlueChannel(from cgImage: CGImage) throws -> [UInt8] {
    // Extract pixels from the blue channel only
    var blueChannel = [UInt8](repeating: 0, count: cgImage.width * cgImage.height)
    // ... populate blueChannel ...
    return blueChannel
}
```

With just one channel to process, the engine could focus on contrast instead of noise. Once I had a base image with more contrast, I implemented adaptive thresholding on top of it. Instead of a fixed cutoff, the engine calculates the background median and adjusts dynamically.

```swift
let backgroundMedian = calculateMedian(data: blueChannel, width: width, height: height)
let thresholdValue = backgroundMedian * (defaultThreshold / 100.0)
```

## From Pixels to Particles

Detecting "dark pixels" is one thing, but my app needed to reason about *particles*. A coffee ground isn't a pixel—it's a cluster of hundreds or thousands of them. So the next step was clustering: finding connected groups of pixels and treating each as a candidate particle.

I refactored the flood-fill algorithm over and over, chasing both speed and accuracy. The original algorithm took nearly fifteen minutes for an iPhone 15 Pro to process, heating the phone and draining the battery. Eventually, I settled on an optimized clustering algorithm that works like a flood fill, but with checks to split apart clumped particles:

```swift
let clusterPixels = quickClusterOptimized(
    startX: startPixel.x,
    startY: startPixel.y,
    pixelGrid: pixelGrid,
    sortedMask: sortedMask,
    counted: &counted,
    maxDistance: maxClusterAxis,
    startIndex: i
)
```

This is where the engine began to "see" individual particles. Coffee grounds are rarely uniform spheres. That's why the engine doesn't just measure size. It records the x and y coordinates of every pixel in a particle. By keeping track of every point, the engine can recognize the difference between a tiny, spherical grind fragment and a long splinter. This matters because grind distribution isn't just about size — it's about shape and overall volume.

```swift
// Calculate centroid
let centroidX = Double(pixels.map { $0.x }.reduce(0, +)) / Double(pixels.count)
let centroidY = Double(pixels.map { $0.y }.reduce(0, +)) / Double(pixels.count)

// Longest distance from centroid = "long axis"
let distances = pixels.map { pixel in
    sqrt(pow(Double(pixel.x) - centroidX, 2) + pow(Double(pixel.y) - centroidY, 2))
}
let longAxis = distances.max() ?? 0
```

I could have started with camera controls or the user interface, but none of those would matter if the analysis engine wasn't accurate. Every project has one piece that makes the rest worthwhile — the part that everything else depends on. Finding that piece early and protecting it from distraction is the difference between tinkering endlessly and shipping something valuable.

So when you're staring at your own blank project, ask yourself: what is the one thing this product absolutely has to get right? Start there. Build around that. The polish and features can come later, but a strong foundation is what turns ideas into tools people trust.