---
slug: introducing-grindlab
title: "Design Diaries: Introducing GrindLab"
date: August 30, 2025
excerpt: "The start of a journey building GrindLab, an iOS app that uses computer vision to analyze coffee grind particles through the iPhone camera."
categories: ["Design", "Engineering"]
---

![GrindLab Logo](/images/posts/grindlab-icon-small.png)

I'm excited to share a project I've been working on that combines two of my passions: great coffee and software development. **GrindLab** is an iPhone app that uses computer vision to analyze coffee grind size distribution, helps you log tasting notes, and provides personalized suggestions to improve your extraction.

Grind size has the largest impact on extraction quality, but measuring it consistently has always been a challenge. Most of us eyeball it or rely on grinder settings that can vary from day to day. GrindLab aims to change that by turning your iPhone's camera into a precise measurement tool, giving you the data you need to dial in the perfect cup.

The app captures three key elements of the coffee brewing process:
- **Visual grind analysis** using your phone's camera to measure particle size distribution
- **Tasting note logging** to track flavor profiles and brewing parameters
- **Intelligent suggestions** that connect your grind data to actionable ways to improve quality

It's been a while since I've dove deep into iOS development, and returning to SwiftUI has been a delightful experience. The framework has matured significantly, and the reactive nature of SwiftUI is particularly well-suited for an app like GrindLab.

GrindLab is still in active development, but I'm excited about the progress so far. The core computer vision pipeline is working reliably, and the SwiftUI interface is coming together beautifully. Next up is refining the suggestion engine and adding more sophisticated brewing parameter tracking.

I'll be sharing more updates as development continues, including some of the technical deep-dives into the image processing algorithms and lessons learned from user testing.