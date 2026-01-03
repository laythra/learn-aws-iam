# Learn AWS IAM Interactively

![Tests](https://github.com/laythra/learnawsiam/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/laythra/learnawsiam/actions/workflows/lint.yml/badge.svg)
![Playwright Tests](https://github.com/laythra/learnawsiam/actions/workflows/playwright.yml/badge.svg)

## 🎯 Purpose

AWS IAM is easily the most fundamental and most used service in the AWS ecosystem. It’s pretty powerful and flexible, but with this great power and flexibility comes inevitable complexity and a steep learning curve.

This Interactive Project, inspired by learn-git-branching, aims to provide a hands-on learning experience that reinforces core principles, helps developers (and anyone working with AWS) develop practical mastery, and build a fundamental understanding of AWS IAM.

## 📚 What You'll Learn

- IAM Users, Groups, and Roles fundamentals
- Policy structure and syntax (Identity-based, Resource-based, Trust policies)
- Permission Boundaries and Service Control Policies (SCPs)
- AWS Organizations and multi-account architectures
- Real-world access control scenarios

## 🧠 How it works

The project presents AWS IAM through an interactive, visual canvas. Instead of reading lengthy documentation, learning happens by directly building real IAM policies to solve concrete, real-world scenarios.

The experience is divided into levels, each offering a concrete set of objectives and a clear visual tutorial to help users lay the foundation for the topic it covers.
Users attempt to finish each objective, where each action performed is validated against actual IAM Rules, the resulting permissions are immediately visible, and the user keeps iterating until the proposed scenario fully resolves

The project presents AWS IAM through an interactive, visual canvas where you **solve real scenarios** by:

- ✅ **Building policies** - Write JSON policies in an integrated editor with real-time validation
- ✅ **Connecting entities** - Drag-and-drop to attach policies to users, groups, and roles
- ✅ **Seeing results** - Immediate visual feedback shows which permissions are granted or denied
- ✅ **Progressive learning** - 12 levels from basics to advanced multi-account scenarios

Each level provides clear objectives, visual tutorials, and validates your solution against actual IAM rules.

## 🏗️ Built With

- **React + TypeScript** - Modern, type-safe UI development
- **XState** - Deterministic state machines for tutorial orchestration
- **ReactFlow** - Interactive canvas for IAM entity visualization
- **CodeMirror** - Professional JSON policy editor
- **Chakra UI** - Accessible, themeable component library

For detailed architecture, see [ARCHITECTURE.md](ARCHITECTURE.md)

## Demo

![Demo of Learn AWS IAM Interactive](./assets/gifs/demo_overview.gif)

## 📋 Prerequisites

**To run locally:**

- **Docker** - That's it! Everything else runs in containers.

**No AWS account needed** - This is a learning simulator, not connected to real AWS.

## 🚀 Getting Started

### Try Online (Recommended)

Visit **[learnawsiam.com](https://learnawsiam.com)** - no installation needed!

### Run Locally

```bash
# Clone the repository
git clone git@github.com:laythra/learnawsiam.git
cd learnawsiam

# Install dependencies and run (requires Docker)
make run-dev
```
