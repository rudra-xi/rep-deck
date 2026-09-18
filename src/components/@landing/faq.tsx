"use client";

import {
	CheckCircleIcon,
	CurrencyDollarIcon,
	RulerIcon,
	GoogleLogoIcon,
	PencilSimpleLineIcon,
	QuestionIcon,
	SwapIcon,
} from "@phosphor-icons/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/constants";

// Icon mapping per FAQ ID — updated to match new questions
const faqIconMap = {
	1: CurrencyDollarIcon, // Is Rep Deck free?
	2: PencilSimpleLineIcon, // Do I need to set up my program?
	3: SwapIcon, // Can I switch between programs?
	4: GoogleLogoIcon, // How does Google login work?
	5: RulerIcon, // What units does Rep Deck use?  ← was DatabaseIcon
};

export const FAQ = () => {
	return (
		<section className="w-full py-20 px-6 bg-background">
			<div className="container max-w-3xl mx-auto space-y-10">
				{/* Header */}
				<div className="text-center space-y-3">
					<h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider">
						Frequently Asked Questions.
					</h2>
					<p className="text-muted-foreground text-base sm:text-lg">
						Everything you need to know about Rep Deck.
					</p>
				</div>

				{/* Accordion List */}
				<Accordion className="w-full space-y-4">
					{faqData.map((item) => {
						const QuestionSpecificIcon =
							faqIconMap[item.id as keyof typeof faqIconMap] ||
							QuestionIcon;

						return (
							<AccordionItem
								key={item.id}
								value={`item-${item.id}`}
								className="border border-border/80 px-6 bg-card/50  transition-colors data-[state=open]:border-primary/50"
							>
								<AccordionTrigger className="text-left font-semibold text-base sm:text-lg hover:no-underline py-5">
									<div className="fcy gap-3">
										<div className="size-8 sh0 fcc border border-primary/30 bg-primary/10 text-primary ">
											<QuestionSpecificIcon
												className="size-4"
												weight="bold"
											/>
										</div>
										<span>{item.question}</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base pb-5 pl-11">
									<div className="ft gap-2.5">
										<CheckCircleIcon
											className="size-5 sh0 text-primary mt-0.5"
											weight="bold"
										/>
										<span>{item.answer}</span>
									</div>
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
			</div>
		</section>
	);
};
