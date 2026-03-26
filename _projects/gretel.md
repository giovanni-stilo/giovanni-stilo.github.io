---
title: "GRETEL: Graph Counterfactual Explanation Evaluation Framework"
notitle: false
description: "An open-source framework for evaluating Graph Counterfactual Explanation methods with built-in datasets, ML models, state-of-the-art explanation techniques, and evaluation measures."
people:
  - Mario A. Prado-Romero
  - Bardh Prenkaj
  - Giovanni Stilo
layout: project
image: "https://raw.githubusercontent.com/aiim-research/GRETEL/main/docs/logo.png"
last-updated: 2024-09-13
---

## Overview

**GRETEL** is an open-source framework for Evaluating Graph Counterfactual Explanation Methods. It is implemented using the Object-Oriented paradigm and the Factory Method design pattern. The main goal is to create a generic platform that allows researchers to speed up the process of developing and testing new Graph Counterfactual Explanation Methods.

GRETEL provides all the necessary building blocks to create bespoke explanation pipelines, including:

- **Datasets**: Both real and synthetic graph datasets
- **ML Models**: Graph Neural Network models for classification
- **Explainers**: State-of-the-art counterfactual explanation techniques
- **Evaluation Metrics**: Comprehensive evaluation measures

## Why Graph Counterfactual Explanations?

Machine Learning systems, particularly Graph Neural Networks (GNNs), have demonstrated outstanding performance in domains like traffic modeling, fraud detection, recommender systems, and drug design. However, their black-box nature limits adoption in high-stakes domains (health, finance) where understanding decision processes is critical.

Graph Counterfactual Explanations (GCE) address this by answering: *"What changes need to be done in the graph to change the prediction of the GNN?"* This provides recourse to users and helps developers identify bias and errors.

## Resources

- [GRETEL v2.0 on GitHub](https://github.com/aiim-research/GRETEL){:target="_blank"}
- [GRETEL v1.0 on GitHub](https://github.com/MarioTheOne/GRETEL){:target="_blank"}

## Key Publications

- **GRETEL 2.0** -- ECML-PKDD 2024 (Demo Track)
- **Developing and Evaluating Graph Counterfactual Explanation with GRETEL** -- WSDM 2023
- **GRETEL: Graph Counterfactual Explanation Evaluation Framework** -- CIKM 2022
- **A Survey on Graph Counterfactual Explanations** -- ACM Computing Surveys (2023)
