"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "motion/react";
import { faqItems } from "@/lib/landing-content";


export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-[960px] px-6 py-16 sm:px-11 sm:py-24">
      <div className="grid gap-8 md:grid-cols-5 md:gap-12">
        <div className="md:col-span-2">
          <h2 className="font-intertight text-3xl font-medium tracking-[-0.01em] text-landing-ink sm:text-[39px]">
            Perguntas frequentes.
          </h2>
          <p className="mt-3 text-lg text-landing-muted sm:text-xl">
            Para quem quer decidir com clareza.
          </p>
        </div>

        <div className="md:col-span-3">
          <Accordion type="single" collapsible>
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b border-landing-ink/10">
                <AccordionTrigger className="cursor-pointer text-left font-intertight text-[15px] font-medium text-landing-ink hover:no-underline sm:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <BlurredStagger text={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

const BlurredStagger = ({ text }: { text: string }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
      },
    },
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <div className="w-full">
      <motion.p
        variants={container}
        initial="hidden"
        animate="show"
        className="break-words text-sm leading-relaxed text-landing-muted sm:text-[15px]"
      >
        {text.split(" ").map((word, index, words) => (
          <span key={index}>
            <motion.span
              variants={letterAnimation}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {word}
            </motion.span>
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.p>
    </div>
  );
};
