"use client";

import {
	CalendarCheckIcon,
	CheckCircleIcon,
	CurrencyDollarIcon,
	GoogleLogoIcon,
	MapTrifoldIcon,
	PencilSimpleLineIcon,
	QuestionIcon,
	RulerIcon,
	SwapIcon,
} from "@phosphor-icons/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/constants";

const faqIconMap = {
	1: CurrencyDollarIcon,
	2: PencilSimpleLineIcon,
	3: GoogleLogoIcon,
	4: SwapIcon,
	5: CalendarCheckIcon,
	6: CalendarCheckIcon,
	7: RulerIcon,
	8: MapTrifoldIcon,
};

export const FAQ = () => {
	return (
		<section className="w-full py-20 px-6 bg-background">
			<div className="container max-w-5xl mx-auto space-y-10">
				<div className="text-center space-y-3">
					<h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider">
						Frequently Asked Questions.
					</h2>
					<p className="text-muted-foreground text-base sm:text-lg">
						Everything you need to know about Rep Deck.
					</p>
				</div>

				<Accordion className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
					{faqData.map((item) => {
						const QuestionSpecificIcon =
							faqIconMap[item.id as keyof typeof faqIconMap] ||
							QuestionIcon;

						return (
							<AccordionItem
								key={item.id}
								value={`item-${item.id}`}
								className="border border-border/80 px-6 bg-card/50 rounded-md shadow-sm transition-colors data-[state=open]:border-primary/50 data-[state=open]:shadow-md"
							>
								<AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline py-4">
									<div className="fcy gap-3">
										<div className="size-8 sh0 fcc border border-primary/30 bg-primary/10 text-primary">
											<QuestionSpecificIcon
												className="size-4"
												weight="bold"
											/>
										</div>
										<span className="pr-2">
											{item.question}
										</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-4 pl-11">
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
