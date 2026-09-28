"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "motion/react";

const faqItems = [
  {
    id: "item-1",
    question: "Como a Opus SoftWorks se diferencia de uma agência comum?",
    answer:
      "A gente não entrega só anúncio ou só site. Olhamos aquisição, operação e presença digital como um sistema único, e medimos tudo pelo resultado que entra no caixa, não por métrica de vaidade.",
  },
  {
    id: "item-2",
    question: "A Opus SoftWorks atende empresas de qualquer tamanho?",
    answer:
      "Trabalhamos melhor com empresas que já faturam e querem crescer com processo. Se o momento for de validar a ideia, dizemos isso na primeira conversa, sem vender o que não faz sentido.",
  },
  {
    id: "item-3",
    question: "Preciso trocar as ferramentas que já uso?",
    answer:
      "Na maioria dos casos, não. Primeiro organizamos o que já existe; só indicamos uma ferramenta nova quando ela resolve um gargalo real e se paga.",
  },
  {
    id: "item-4",
    question: "Em quanto tempo vejo resultado?",
    answer:
      "Tráfego pago costuma dar sinais nas primeiras semanas; sistemas e automações dependem do escopo. No diagnóstico você recebe um plano com prazos e indicadores claros para cada etapa.",
  },
  {
    id: "item-5",
    question: "Como funciona o acompanhamento depois da entrega?",
    answer:
      "A otimização contínua faz parte do trabalho: reuniões periódicas, relatórios em linguagem simples e ajustes constantes. Nada de entregar e sumir.",
  },
  {
    id: "item-6",
    question: "Quanto custa?",
    answer:
      "Depende do escopo, por isso o primeiro passo é o diagnóstico. Você recebe uma proposta fechada, sem surpresa no meio do caminho.",
  },
];

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
