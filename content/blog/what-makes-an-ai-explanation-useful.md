---
title: "What Makes an AI Explanation Useful?"
description: "A research perspective on evaluating AI explanations: who needs them, what they reveal, and which decisions they can help people make."
date: 2026-10-07 09:00:00 +0200
tags: [Explainable AI, Evaluation, Research Perspectives]
published: true
---

A model produces a prediction. An explanation accompanies it: a highlighted
region, a ranked list of features, or an example of what would change the
outcome. What should we ask next?

One useful starting point is to ask what the explanation enables someone to do.
Does it help a researcher detect a shortcut in the model? Does it help a person
understand a decision? Does it reveal when the model should be questioned?
These are different goals, and a single explanation may serve them differently.

## Start with the question and the audience

Consider three people examining the same prediction. A researcher may want to
diagnose the model's behaviour. A domain expert may want to check whether it
depends on relevant information. A person affected by the prediction may want
to understand which inputs could change the result.

Before choosing an explanation method, it helps to write down the intended
audience, their question, and the task the explanation should support.
[Doshi-Velez and Kim's position paper on interpretable machine learning](https://arxiv.org/abs/1702.08608)
argues for rigorous evaluation and proposes a taxonomy for that purpose. It is
a useful starting point for thinking about how to evaluate an explanation in
its intended setting.

## Connect the explanation to the model

An explanation should make clear what it describes and the scope of that
description. An account of one prediction and a summary of a model's behaviour
across a dataset answer different questions.

For example, [Ribeiro, Singh, and Guestrin introduce LIME](https://arxiv.org/abs/1602.04938),
which learns an interpretable model locally around a prediction. That local
scope matters: an explanation of one case does not by itself establish how the
model behaves everywhere.

For a research study, useful questions include:

- Which model behaviour is the explanation intended to describe?
- How will the study check that the explanation reflects that behaviour?
- Which inputs, settings, and assumptions does the check cover?
- What information does the explanation leave out?

These questions turn an attractive visualization into something we can examine
and test. They also help us report the boundaries of any conclusions.

## An illustrative example: explaining a recommendation

Imagine a system recommends a research paper. One explanation says that it
shares keywords with papers a reader saved. Another says that it connects two
topics in the reader's citation network. A third shows how the recommendation
would change if a saved paper were removed.

This is a hypothetical example. Each explanation invites a different check.
The keyword account invites us to inspect topic overlap. The network account
invites us to inspect the connections. The changed-input account invites us to
test the recommendation under that change.

To investigate usefulness, we could ask readers to identify irrelevant
recommendations with and without an explanation. We could then examine task
performance, time, and the reasons readers give for their choices. This is a
possible study design, rather than a reported experimental result.

The central question would be whether the explanation helps readers judge the
recommendation, including cases where the system makes a mistake.

## Counterfactuals bring another question

A counterfactual explanation considers how an input would need to change for
a model to produce a different outcome.
[Wachter, Mittelstadt, and Russell](https://arxiv.org/abs/1711.00399) discuss
counterfactual explanations in relation to understanding and acting on
automated decisions.

For an evaluation, I would ask both whether the proposed change alters the
model's output and whether the change makes sense in the application. A change
that is easy to express mathematically may be difficult for a person to make.
The distinction gives us a concrete research question: which constraints should
an explanation method respect to be useful for its intended audience?

## Limitations and open questions

The considerations here are a framework for discussion, rather than a universal
score for explanation quality. The right evaluation depends on the task, the
audience, and the explanation's stated purpose.

Some questions deserve particular attention:

- How can a study distinguish understanding from confidence in an explanation?
- What should an explanation communicate when several accounts are possible?
- How should evaluations cover cases where the model's prediction is wrong?
- How much detail helps a reader, and when does it become a distraction?

## Takeaways

When designing an explanation study, start with the person and the question.
State what the explanation claims to describe. Choose checks that match those
claims, and evaluate whether it supports the intended task.

That gives us a practical question to carry into research: **what would count as
evidence that this explanation is useful for this audience?**

## References and further reading

- Finale Doshi-Velez and Been Kim (2017).
  [Towards A Rigorous Science of Interpretable Machine Learning](https://arxiv.org/abs/1702.08608).
- Marco Tulio Ribeiro, Sameer Singh, and Carlos Guestrin (2016).
  ["Why Should I Trust You?": Explaining the Predictions of Any Classifier](https://arxiv.org/abs/1602.04938).
- Sandra Wachter, Brent Mittelstadt, and Chris Russell (2018).
  [Counterfactual Explanations without Opening the Black Box: Automated Decisions and the GDPR](https://arxiv.org/abs/1711.00399).
