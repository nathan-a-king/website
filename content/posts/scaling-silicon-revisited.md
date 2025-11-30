---
slug: scaling-silicon-revisited
title: "Scaling Silicon Revisited"
date: November 30, 2025
excerpt: "A new post about scaling silicon revisited."
categories: ["Hardware"]
---

In January 2023, I published [an article](#original-article) about the diverging strategies of Intel, AMD, and Apple in processor design. The core argument was simple: as transistors shrink and wafer costs soar, the economics of chip manufacturing would force fundamental changes in how we build silicon. AMD's chiplet approach offered cost advantages. Apple's monolithic system-on-a-chip strategy provided complete integration but faced scaling challenges. Intel was... well, Intel was figuring things out.

Two years later, something fascinating has happened. Not only have the predictions held up remarkably well, but the industry appears to be converging on a single answer to the scaling problem—and it's not the answer I expected Apple to embrace.

[[CHIPLET_TIMELINE]]

## The Original Argument

The 2023 piece hinged on basic semiconductor economics. Using Apple's M1 and M1 Max as examples, I calculated how die size affects both the number of chips per wafer and manufacturing yield. The math was straightforward but unforgiving:

- **M1** (119 mm²): 478 dies per wafer, 88.9% yield = 425 good chips
- **M1 Max** (440 mm²): 117 dies per wafer, 65.4% yield = 76 good chips

That's a 5.6x difference in good chips from the same wafer, which directly translates to cost. I estimated the M1 Max at $223 in materials cost versus $40 for the base M1. The M1 Ultra, being two M1 Max dies on an interposer, would cost around $450 in silicon alone.

The conclusion was that Apple would hit a ceiling. Going bigger than Ultra would price the Mac Pro out of its market. Mark Gurman had reported that a larger Mac Pro SoC would likely start at $10,000—economics that just didn't make sense.

Meanwhile, AMD's chiplet approach was betting on a different future: smaller dies with better yields, mixed across different process nodes, assembled into configurations that could scale from 8 to 192 cores.

## What Actually Happened

In June 2023, Apple released the Mac Pro with the M2 Ultra. The starting price? $6,999. It was, as expected, two M2 Max dies connected via UltraFusion technology on an interposer—the exact architecture I had analyzed.

And then... nothing.

As of late 2025, the Mac Pro is still running M2 Ultra. Meanwhile, the Mac Studio leapfrogged it with M3 Ultra in March 2025, and you can now get a Mac Studio with M4 Max that outperforms the Mac Pro in many workloads. The product that was supposed to be Apple's performance flagship has become a semi-abandoned curiosity, valuable mainly for its PCIe slots.

[[COST_COMPARISON]]

The hypothetical Mac Pro with a chip larger than M2 Ultra never materialized. The $10,000+ starting price that would have required made it a non-starter. The physics won.

This is where things get interesting. AMD didn't just succeed with chiplets—they essentially won the architectural debate.

In 2024, AMD received the IEEE Corporate Innovation Award for pioneering chiplet design research. According to IEEE, AMD's chiplet architecture has "nearly halved" the manufacturing cost of modern processors while delivering greater memory bandwidth and compute capability than monolithic designs.

But the real vindication goes beyond awards. Universal Chiplet Interconnect Express (UCIe)—an open standard for chiplet communication created in 2022—now has support from AMD, Intel, Nvidia, Arm, and dozens of other industry players. Even rivals are standardizing around the approach AMD pioneered.

The cost advantages I described in 2023? They're now industry consensus. Chiplets enable:

- **Better yields** by keeping dies small
- **Mixed process nodes** (cutting-edge 3nm for CPUs, cheaper nodes for I/O)
- **Design reuse** across product lines
- **Faster time-to-market** for new configurations

AMD's recent Financial Analyst Day in November 2025 showed a company that has never been in a stronger position. They're securing over $50 billion in design wins, expanding across cloud, edge, and embedded markets, all built on their chiplet foundation.

### The Process Node Journey Played Out on Schedule

Remember that chart in my original article showing the slowing pace of transistor size reduction? TSMC's roadmap has followed it almost exactly.

Apple's M3 launched on TSMC's first-generation 3nm process (N3B) in late 2023. But N3B was always known to be expensive—a stepping stone until the more economical N3E process matured. Several industry observers noted at the time that Apple was basically paying a premium to be first to 3nm, knowing they'd need to transition quickly.

Sure enough, the M4 arrived in May 2024 on N3E, TSMC's second-generation 3nm process. N3E offers better yields, lower costs, and actually enabled Apple to add more transistors (28 billion vs. M3's count) while improving both performance and efficiency. The quick M3-to-M4 transition wasn't a sign of trouble—it was a planned migration from an expensive process to a cost-optimized one.

TSMC is now ramping N3P (third-generation 3nm) for even better performance and density. The progression is exactly what you'd expect when the easy gains from shrinking are gone: iterate on the process, optimize yields, reduce costs. The "fundamental rethinking" I mentioned in 2023 is here.

[[ARCH_EVOLUTION]]

## The Plot Twist: Apple's Apparent Conversion

Here's where the story takes an unexpected turn.

In July 2024, reports emerged that Apple is developing its M5 processor using TSMC's SoIC (System on Integrated Chip) technology—a fundamentally different approach than anything Apple has done before. Not just UltraFusion connecting two complete SoCs, but actual modular chiplets.

The rumored design would split the processor into separate tiles:
- A large CPU tile with all the processor cores
- A large GPU tile with graphics cores  
- Smaller controller tiles for memory, I/O, and other functions

Each tile could be manufactured separately, potentially on different process nodes, then integrated using 3D stacking technology. It's a true chiplet architecture, more similar to AMD's approach than to Apple's traditional monolithic SoC design.

What makes this particularly intriguing is the reported dual-use strategy. These M5 chips are allegedly being designed to serve both consumer Macs *and* Apple's AI cloud servers. Apple's current cloud infrastructure reportedly uses multiple M2 Ultra chips ganged together—a stopgap solution. A purpose-built chiplet design could serve both markets while sharing development costs.

If this happens—and it's still rumored, not confirmed—it would represent Apple acknowledging the same fundamental limits I wrote about in 2023. You can only push monolithic dies so far before yield and cost become untenable. Beyond that point, you need modularity.

## Why This Matters: The Physics of the Situation

The convergence toward chiplets isn't a fashion trend or a marketing decision. It's being driven by immutable physical and economic realities.

[[YIELD_IMPACT]]

Let me put some updated numbers to this. A 300mm wafer on TSMC's N3 process now costs roughly $18,000-$20,000 (up from ~$17,000 on N5). When you factor in yield losses from defect density, the math becomes even more punishing for large dies.

A 600mm² die—roughly 36% larger than the M1 Max—would see yields drop to around 45% with standard defect densities. You'd get maybe 75 dies per wafer, with only 34 of them good. At $18,000 per wafer, that's over $500 in materials cost per chip, before packaging, before testing, before any other manufacturing steps.

Compare that to four 150mm² chiplets. Each has 90%+ yield. You can bin them separately, mixing and matching to create different SKUs. If one tile has a defect, you don't lose the entire chip. And you can manufacture your I/O tile on a cheaper, older process node since it doesn't need cutting-edge transistor density.

This is why AMD can offer 192-core EPYC processors while Apple topped out at the M2 Ultra's 24 cores (actually 20 CPU cores + 4 efficiency cores). It's not that Apple's engineers lack ambition. It's that the economics of monolithic dies break down past a certain size.

## The Broader Implications

What does it mean when the entire industry converges on the same architectural approach?

**For Apple**, it suggests a recognition that their vertical integration advantage has limits. They can design world-class SoCs for phones, tablets, and consumer laptops. But for high-performance computing—whether desktop workstations or cloud AI servers—the monolithic approach hits a wall. Chiplets let them stay competitive without building economically impossible chips.

**For AMD**, it's complete vindication. They made a bet in 2017 with first-gen Ryzen and EPYC that chiplets were the future. They were mocked by some for it. Now they've won an IEEE award, they're setting industry standards, and their erstwhile competitors are following their lead.

**For Intel**... well, Intel is also going chiplets. Their Meteor Lake and upcoming processors use a disaggregated architecture with separate tiles. The difference is Intel was forced into it by manufacturing struggles, while AMD chose it strategically.

**For the industry**, it signals that Moore's Law scaling—in its traditional form of doubling transistors on a monolithic die every two years—is truly over. The new game is heterogeneous integration: different chiplets, different process nodes, different functions, all assembled into a coherent system.

UCIe standardization is crucial here. When companies can use a common interconnect standard, it lowers barriers for smaller players and enables an ecosystem of specialized chiplet suppliers. We might see a future where you can buy CPU tiles from one vendor, GPU tiles from another, and assemble them into custom configurations. That's speculative, but the groundwork is being laid.

## What I Didn't Anticipate

Let me be honest about what surprised me.

I didn't expect Apple to move toward chiplets this quickly. I thought they'd stretch the monolithic SoC approach further, perhaps with more sophisticated binning or with slight improvements in process technology buying them another generation or two. The rumored pivot to SoIC for M5 suggests the limits are harder than I realized, or that their ambitions for cloud AI are driving faster change.

I also underestimated how quickly N3E would mature. The transition from N3B to N3E happened faster than I expected, and the yields on N3E appear to be excellent. TSMC has gotten remarkably good at process iteration.

Finally, I didn't fully appreciate how important standardization would become. UCIe went from "interesting consortium" to "critical industry infrastructure" faster than I would have guessed. The fact that AMD, Intel, Nvidia, and Arm all got behind it suggests everyone sees the same future.

## Looking Forward: What's Next?

If we accept that chiplets are the dominant paradigm for high-performance computing going forward, what comes next?

**Process node progression will slow further**. We're already seeing the gap between nodes expand from ~2 years to 3+ years. TSMC's roadmap shows N3, N2, and eventually A16 (their "1.6nm-class" node), but the cadence is slowing and the gains per node are diminishing. The focus shifts from "smaller transistors" to "better integration."

**3D stacking becomes critical**. Technologies like SoIC, TSMC's CoWoS, and Intel's Foveros enable vertical integration—stacking chiplets on top of each other for better density and shorter interconnects. This is where much of the innovation will happen.

**Software must evolve**. Heterogeneous systems with variable latency between chiplets require different programming models. The "everything is uniform memory" abstraction that works on monolithic SoCs starts to break down. We'll need better compiler support, better scheduling, better awareness of the underlying topology.

**The definition of "SoC" will blur**. What do we call a system with six chiplets integrated on an interposer? Is it still a system-on-a-chip, or is it something else? The terminology will need to catch up with the reality.

As for Apple specifically, I'm curious whether they'll:
1. Release M5 as a true chiplet design, or
2. Keep M5 monolithic for consumer Macs but use chiplets for server variants, or  
3. Abandon the Mac Pro entirely and focus on Mac Studio as their high-end offering

The Mac Pro in its current form feels like a product searching for a purpose. If Apple can't build a chip significantly more powerful than M2 Ultra without breaking the economics, what's the point? PCIe slots alone don't justify a $7,000 premium over Mac Studio for most users.

## The Curiosity Factor

What fascinates me most about this whole journey isn't being right or wrong about specific predictions. It's watching how fundamental constraints—defect density, reticle limits, wafer costs—shape the decisions of companies worth trillions of dollars.

Apple is one of the most powerful companies in history. They have effectively unlimited R&D budget, close partnerships with TSMC, and the best chip designers in the world. And yet, they appear to be bending to the same physical and economic realities that forced AMD to rethink chip architecture back in 2017.

That's not a failure on Apple's part. It's just physics.

The same math that made chiplets attractive to AMD—better yields, lower cost per working chip, mix-and-match flexibility—applies to everyone. Intel discovered this. Apple appears to be discovering it now. Even Nvidia, with their massive monolithic GPU dies, is exploring chiplet-based designs for future products.

The industry is converging not because everyone copied AMD, but because everyone is reading the same defect density charts and wafer cost sheets and coming to the same inevitable conclusion.

## Closing Thoughts

When I wrote the original article in January 2023, I was trying to understand how three different companies would scale their architectures in the face of slowing process improvements. The question was: which strategy would win?

Two years later, the answer appears to be: chiplets won. Not AMD's specific implementation necessarily, but the fundamental approach of modular, heterogeneous integration.

Apple's rumored move to SoIC chiplets for M5 would be the clearest signal yet that the monolithic SoC era—at least for high-performance computing—is over. We're entering a new phase where the packaging and integration matter as much as the transistors themselves.

Will I be writing another follow-up in 2027 saying I got this wrong again? Maybe! The fun part about analyzing technology is that the ground keeps shifting. But right now, the convergence toward chiplets looks like one of those rare moments where an entire industry shifts direction almost in unison, driven by math that doesn't care about brand loyalty or platform preferences.

The chips have spoken, and they're saying: think smaller, integrate smarter, and embrace modularity. Even Apple is listening.

---

## Original Article

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