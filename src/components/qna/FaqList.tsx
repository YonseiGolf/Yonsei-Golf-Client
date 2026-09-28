import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

export default function FaqList({
	items,
}: { items: readonly { question: string; answer: string }[] }) {
	return (
		<Accordion type="multiple" className="mx-auto w-[95%] max-w-[800px] space-y-5">
			{items.map((item) => (
				<AccordionItem
					key={item.question}
					value={item.question}
					className="rounded-[20px] border-0 bg-muted px-5"
				>
					<AccordionTrigger className="rounded-xl py-5 text-base font-bold leading-relaxed hover:no-underline">
						{item.question}
					</AccordionTrigger>
					<AccordionContent className="faq-answer pb-5 text-sm leading-relaxed">
						<p>{item.answer}</p>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}
