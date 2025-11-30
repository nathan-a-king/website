---
slug: scaling-silicon-revisited
title: "Scaling Silicon Revisited"
date: November 30, 2025
excerpt: "A new post about scaling silicon revisited."
categories: ["Hardware"]
---

In January 2023, I published an article about the diverging strategies of Intel, AMD, and Apple in processor design. The core argument was simple: as transistors shrink and wafer costs soar, the economics of chip manufacturing would force fundamental changes in how we build silicon. AMD's chiplet approach offered cost advantages. Apple's monolithic system-on-a-chip strategy provided complete integration but faced scaling challenges. Intel was... well, Intel was figuring things out.

Two years later, something fascinating has happened. Not only have the predictions held up remarkably well, but the industry appears to be converging on a single answer to the scaling problem—and it's not the answer I expected Apple to embrace.

---

Original Article:

Apple raised eyebrows in 2020 when the company announced plans to transition from Intel processors to chips designed in-house, marking the end of a 15-year partnership with Intel.^1^ For long-time followers of technology, it was reminiscent of Steve Jobs' announcement at the 2005 Worldwide Developers Conference (WWDC), where he revealed Apple's plan to transition from PowerPC to the x86 architecture from Intel. Like the x86 transition fifteen years earlier, the rollout of Apple silicon went astonishingly smoothly despite the fundamental incompatibility between x86 and ARM instruction sets. For the first time in the recent past, Intel, Advanced Micro Devices (AMD), and Apple have taken divergent strategies in microarchitecture design. Each strategy has its own strengths and weaknesses, so it will be fascinating to see how well each approach scales to the future's cost, efficiency, and performance demands. AMD's chiplet design offers pricing advantages over Intel at the expense of bandwidth constraints and increased latency. Apple's system-on-a-chip (SoC) strategy requires larger dies but offers complete integration; however, we may be seeing the first cracks in Apple's ARM SoC strategy after scaling back plans for a high-end Mac Pro.^2^ According to Mark Gurman's reporting, a Mac Pro with an SoC larger than the M1 Ultra would likely have a starting cost of $10,000. To get a better perspective on the pricing challenges Apple may be facing when designing an SoC for the Mac Pro, let's explore how yield and cost change as die size increases.

For example, we can calculate the number of rectangular dies per circular wafer for Apple's basic M1 SoC and the M1 Max using basic geometry:

| **Specification** | **M1** | **M1 Max** |
|-------------------|--------|------------|
| **Die Dimensions** | 10.9 mm x 10.9 mm | 22 mm x 20 mm |
| **Die Size** | 118.81 mm^2^ | 440 mm^2^ |
| **Scribe Width** | 200 µm | 200 µm |
| **Wafer Diameter** | 300 mm | 300 mm |
| **Edge Loss** | 5.00mm | 5.00 mm |
| **Die Per Wafer** | 478 | 117 |

The smaller M1 dies give us four times the quantity per wafer over the M1 Max. This is one factor influencing the cost of physical materials, but things get really interesting once we begin calculating yields. The process of fabricating working silicon wafers is delicate and rife with the opportunity to produce imperfections. Defects can be caused by contamination, design margin, process variation, photolithography errors, and various other factors. Yield is a quantitative measure of the quality of the semiconductor process and is one of the most important factors in wafer cost. The measure used for defect density is the number of defects per square centimeter. Assuming a standard defect density of 0.1/cm^2^ using a variable defect size yield model for TSMC's N5 node, our two wafers possess vastly different yields:^3^

This yield disparity increasing from 4x to just over 5.5x further inflates our larger die's already higher manufacturing cost. Just how much of a price difference? Extrapolating data from the Center for Security and Emerging Technology, we can estimate that a 300 mm wafer created using TSMC's N5 node costs just under $17,000.^4^

Therefore, our M1 has a theoretical materials cost of $40 while our M1 Max has a cost of $223. Given that an M1 Ultra is two M1 Max dies connected via an interposer, the raw silicon cost of the Ultra is likely around $450. While all these figures are nothing more than conjecture, they clearly illustrate how quickly costs skyrocket and yields shrink as die size increases.

Where does this leave the Mac Pro and the Apple silicon roadmap? Cost-effective silicon capable of performance significantly higher than the current top-tier SoC will likely require a more advanced lithography process to decrease transistor size. A likely candidate is TSMC's N3 node, which is where Apple is headed over the subsequent few product cycles. However, the rate at which manufacturers are able to decrease transistor size is rapidly slowing, as evidenced in the chart below, so a more fundamental rethinking of chip manufacturing is on the horizon.

One certainty is that we are entering an exciting period of technological advancement that is beginning to disrupt the market. The ability of technology companies to adapt quickly is shifting from a mere competitive advantage to a requirement for survival. The future belongs to those who dare to think without boundaries.

---

**References:**

^1^ Gurman, M., & King, I. (2020, June 22). _Apple-made computer chips coming to Mac, in split from Intel._ Bloomberg.com. Retrieved December 26, 2022, from [https://www.bloomberg.com/news/articles/2020-06-22/apple-made-computer-chips-are-coming-to-macs-in-split-from-intel?sref=9hGJlFio][0]

^2^ Gurman, M. (2022, December 18). _Apple scales back high-end Mac Pro plans, weighs production move to Asia._ Bloomberg.com. Retrieved December 30, 2022, from [https://www.bloomberg.com/news/newsletters/2022-12-18/when-will-apple-aapl-release-the-apple-silicon-mac-pro-with-m2-ultra-chip-lbthco9u][1]

^3^ Cutress, I. (2020, August 25). _'Better yield on 5nm than 7nm': TSMC update on defect rates for N5._ AnandTech. [https://www.anandtech.com/show/16028/better-yield-on-5nm-than-7nm-tsmc-update-on-defect-rates-for-n5][2]

^4^ Kahn, S., & Mann, A. (2022, June 13). _AI chips: what they are and why They Matter._ Center for Security and Emerging Technology. Retrieved December 30, 2022, from [https://cset.georgetown.edu/publication/ai-chips-what-they-are-and-why-they-matter][3]

**Further Reading:**

Agrawal, V. D. (1994). A tale of two designs: the cheapest and the most economic. _Journal of Electronic Testing_, 5(2–3), 131–135. [https://doi.org/10.1007/bf00972074][4]

[0]: https://www.bloomberg.com/news/articles/2020-06-22/apple-made-computer-chips-are-coming-to-macs-in-split-from-intel?sref=9hGJlFio
[1]: https://www.bloomberg.com/news/newsletters/2022-12-18/when-will-apple-aapl-release-the-apple-silicon-mac-pro-with-m2-ultra-chip-lbthco9u
[2]: https://www.anandtech.com/show/16028/better-yield-on-5nm-than-7nm-tsmc-update-on-defect-rates-for-n5
[3]: https://cset.georgetown.edu/publication/ai-chips-what-they-are-and-why-they-matter
[4]: https://doi.org/10.1007/bf00972074