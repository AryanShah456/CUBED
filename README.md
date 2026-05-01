# Cubed — Rubik's Cube Solver
# OVERVIEW
Cubed is a high-performance, web-based Rubik's Cube solver designed to help both speedcubers and beginners master the puzzle. 
It provides an interactive platform where users can input their cube's state and receive a detailed, step-by-step solution 
based on standardized cubing logic.The project combines technical engineering with an educational approach, featuring not only a 
solver but also a comprehensive learning suite for cube notation.PROBLEM THIS PROJECT SOLVESLearning to solve a Rubik's Cube can 
be a daunting task due to complex algorithms and confusing notation. Many beginners find static tutorials difficult to follow when
applied to their specific scramble.Cubed solves this by:Providing a customized solution for any valid $3 \times 3$ scramble.
Offering a visual "painting" interface that eliminates the need to understand notation just to input a cube.Breaking down the 
solution into human-readable layers.Including an interactive quiz to bridge the gap between following a solver and memorizing moves.

# CORE FEATURES
Visual Cube InputInteractive 6-panel interface to "paint" the colors of your physical cube. Real-time state tracking to ensure the cube 
layout is valid before solving. Notation-Based SolverSupport for standard scramble notation (e.g., R U R') for advanced users. Instant 
generation of solution sequences. Layer-by-Layer (LBL) LogicSolutions are generated using the beginner-friendly LBL method.
Covers all stages: 
• White Cross, 
• First Two Layers (F2L) corners, 
• Middle Layer, 
• OLL, 
• PLL. 
Notation Guide & Training. A dedicated reference library explaining 
every move (R, L, U, D, F, B and their primes). An interactive quiz system to test the user's knowledge of cube notation. Modern Technical UIA 
"glassmorphism" aesthetic with a dark-themed, high-contrast interface. Responsive design utilizing professional typography like Bebas Neue and 
DM Sans.

# PROJECT STRUCTURE
• index.html: The main landing page featuring 3D illustrations and an overview of features.
• solver.html: The core application interface containing the visual input and solution output.
• notations.html: The educational hub for learning and practicing move sets.
• style.css: Global stylesheet containing design tokens, animations, and responsive layout rules.
• solver-engine.js: The "brain" of the app; contains the algorithms and Breadth-First Search (BFS) logic.
• cube-input.js: Manages the interactive color picker and visual state of the 2D cube.
• notations.js: Handles the logic for the notation quiz and instructional highlights.


# TECHNOLOGIES USED
• FrontendHTML5 (Semantic Layout)
• CSS3 (Custom Properties & Flexbox/Grid)
• JavaScript (ES6+, Functional Logic)
• Other ToolsGoogle Fonts (Bebas Neue, DM Sans, DM Mono)
• OpenCV/Python (for experimental color detection features) (Beta testing currently)

# HOW IT WORKS
• Input: The user inputs the cube state via the visual painter or a scramble string.
• Validation: The system verifies that the input is a mathematically solvable cube (e.g., checking for 9 stickers of each color and correct center placements).
• Solving: The engine executes a series of algorithms to solve the cube layer by layer.
• Output: The user is presented with a clear sequence of moves to solve their physical cube.

# INSTALLATION AND SETUP
• To run this project locally:
• Download or clone the repository.
• Open the project folder.
• Ensure all .js and .css files are in their respective directories as linked in the HTML.
• Open index.html in any modern web browser.

# PROJECT GOALS
This project aims to:
• Simplify the Rubik's Cube learning curve through interactivity.
• Provide a high-performance, lightweight tool for the cubing community.
• Demonstrate the application of algorithmic logic in web development.



