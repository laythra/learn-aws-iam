# Learn AWS IAM Interactively

![Tests](https://github.com/laythra/learnawsiam/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/laythra/learnawsiam/actions/workflows/lint.yml/badge.svg)
![Playwright Tests](https://github.com/laythra/learnawsiam/actions/workflows/playwright.yml/badge.svg)

## 🎯 Purpose

AWS IAM is easily the most fundamental and most used service in the AWS ecosystem. It’s pretty powerful and flexible, but with this great power and flexibility comes inevitable complexity and a steep learning curve.

This Interactive Project, inspired by learn-git-branching, aims to provide a hands-on learning experience that reinforces core principles, helps developers (and anyone working with AWS) develop practical mastery, and build a fundamental understanding of AWS IAM.

## 🧠 Core Idea

The project presents AWS IAM through an interactive, visual canvas. Instead of reading lengthy documentation, learning happens by directly building real IAM policies to solve concrete, real-world scenarios.

The experience is divided into levels, each offering a concrete set of objectives and a clear visual tutorial to help users lay the foundation for the topic it covers.
Users attempt to finish each objective, where each action performed is validated against actual IAM Rules, the resulting permissions are immediately visible, and the user keeps iterating until the proposed scenario fully resolves

## High-Level Architecture

The project is built entirely on React with Typescript, composed of the following major subsystems, which enable the learning experience to come to life:

- **Canvas Layer:** The visual representation of the various IAM components (Policies, Users, Groups, etc.) built with ReactFlow
- **State & Event System:** The very backbone of each level, where each level is represented as an event-driven state machine, each built with XState.
- **UI Layer:** Popups, Popovers, tooltips, and more are present at every level to enrich the overall experience built with ChakraUI - **Animations**: Go hand-in-hand with the event-driven state machine layer, where animations are triggered based on each level’s various state changes and event-driven model
- **Text & Content Layer:** Using Markdown with customized extensions to achieve a comprehensive engine to help power rendered texts across the application in tutorials and other areas
- **Policies Validations with JSON Schemas:** Using AJV to validate written policies in real-time against a set of JSON Schemas, which define the correct format policies should follow to complete each objective.

## Demo

![Demo of Learn AWS IAM Interactive](./assets/gifs/demo_overview.gif)

## Getting Started

### Online Version

A hosted version of the project is available here:
https://learnawsiam.com

### Run Locally

```bash
git clone git@github.com:laythra/learnawsiam.git
cd learnawsiam
make run-dev
```
