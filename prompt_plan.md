Code Generation Prompts
Prompt 1: Project Setup and Basic Structure
I'm building an NBA player comparison web application using React. Let's start by setting up the project with TypeScript and essential dependencies.

Please help me:
1. Initialize a new React application with TypeScript
2. Install necessary dependencies (React Router, styled-components)
3. Set up a basic folder structure following best practices
4. Create a simple App component with routing for these pages:
   - Home page
   - Player Comparison page
   - Clusters page

For each file, include appropriate TypeScript types and comments explaining the purpose. The application should have a clean, modern structure that will scale well as we add more features.

Prompt 2: Basic Layout Components
Now that we have our project structure, let's create the basic layout components for our NBA player comparison app.

Please help me implement:
1. A Header component with:
   - App title/logo
   - Navigation links to our main pages (Home, Player Comparison, Clusters)
   - Responsive design that works on mobile

2. A Footer component with:
   - Basic copyright information
   - Links to (placeholder) documentation and about pages

3. A MainLayout component that:
   - Wraps the Header, main content area, and Footer
   - Handles responsive layout adjustments
   - Uses styled-components for styling

Make sure all components are typed correctly with TypeScript and include basic unit tests for each component using React Testing Library.

Prompt 3: Data Models and Loading Utilities
Let's implement the data models and utilities for our NBA player comparison app. We need to handle loading and processing player data from CSV files. I already have some calculations with this data using python + pandas. How would you structure this project to create now the python code?

Please help me create:

1. Interfaces for our data models:
   - Player interface with all relevant stats (points, rebounds, assists, etc.)
   - Team interface
   - Season interface

2. A data loading utility that:
   - Parses CSV data into our models
   - Handles potential errors in the data
   - Includes functions to filter and sort the data

3. A simple context provider for data management:
   - Create a DataContext with React Context API
   - Implement a DataProvider component that loads and provides the data
   - Include loading and error states

Include unit tests for the data loading and processing functions. For now, we can use a sample CSV string in our tests, similar to the format you provided earlier.

Prompt 4: Player Search and Selection Components
Now let's build the player search and selection components for our NBA comparison app.

Please help me implement:

1. A PlayerSearch component that:
   - Includes an input field with autocomplete functionality
   - Displays matching players as the user types
   - Handles keyboard navigation and selection
   - Is styled with styled-components
   - Is fully accessible

2. A PlayerSelection component that:
   - Manages the state of selected players (up to 3 players)
   - Displays selected players with basic info (name, team, position)
   - Includes a remove button for each selected player
   - Has a clear all button

3. Connect these components to our DataContext from the previous step

Include unit tests for both components, testing the search functionality, selection, and removal of players. Make sure the components are responsive and work well on both desktop and mobile.

Prompt 5: Basic Chart Components
Let's implement the basic chart components for visualizing player stats in our NBA comparison app. We'll use Recharts for this implementation.

Please help me create:

1. A RadarChart component that:
   - Takes an array of players and their stats as props
   - Displays a radar/spider chart comparing key stats (points, rebounds, assists, steals, blocks)
   - Includes a legend to identify each player
   - Has tooltips showing exact values on hover
   - Is responsive to different screen sizes

2. A BarChart component that:
   - Takes the same data as the RadarChart
   - Shows a grouped bar chart comparing the same stats
   - Includes proper labeling and tooltips
   - Is also responsive

3. A ChartContainer component that:
   - Wraps either chart type
   - Includes a toggle to switch between chart types
   - Handles the state for which chart is displayed

Include unit tests for each component, testing the rendering and interaction. Make sure to handle edge cases like missing data or only one player selected.
.
Prompt 6: Player Stats Display
Let's create components to display detailed player statistics in our NBA comparison app.

Please help me implement:

1. A PlayerStatsCard component that:
   - Displays comprehensive stats for a single player
   - Organizes stats into logical categories (scoring, rebounding, etc.)
   - Uses a clean, readable layout
   - Highlights key stats

2. A StatsComparison component that:
   - Takes multiple players (2-3) as input
   - Shows their stats side by side in a table format
   - Highlights the better stat in each category
   - Is responsive and adapts to mobile view

3. Utility functions for:
   - Formatting stat values appropriately (percentages, decimals, etc.)
   - Calculating derived stats (true shooting percentage, etc.)
   - Determining which player has the better stat in each category

Include unit tests for the components and utility functions. Ensure the display is accessible and easy to read on all device sizes.

Prompt 7: Similar Players Feature
Now let's implement the similar players feature, which is a key part of our NBA comparison app.

Please help me create:

1. A SimilarPlayers component that:
   - Takes a selected player as input
   - Displays a list of the most similar players based on our algorithm
   - Shows similarity scores for each player
   - Allows users to select a similar player for comparison

2. A SimilarityScore component that:
   - Visualizes the similarity between two players
   - Uses a gauge or meter to represent the score
   - Includes a brief explanation of what the score means

3. Connect these components to our existing player selection system so that:
   - When a user selects a player, similar players are automatically shown
   - Users can add a similar player to the comparison with one click

For testing purposes, we can use a mock function that returns hardcoded similar players. Include unit tests for both components and their integration with the existing system.


Prompt 8: Visualization Toggle and Interactivity
Let's enhance our NBA comparison app with better visualization controls and interactivity.

Please help me implement:

1. An improved VisualizationToggle component that:
   - Allows switching between different chart types (radar, bar, and now line charts)
   - Includes animation for smooth transitions between chart types
   - Has a clean, intuitive UI
   - Remembers the user's preference

2. Interactive elements for our charts:
   - Click handlers for chart elements to show more detailed information
   - Ability to highlight specific stats across players
   - Option to normalize stats (per game, per 36 minutes, per 100 possessions)

3. A StatFilter component that:
   - Allows users to select which stats to include in visualizations
   - Has preset options (offensive stats, defensive stats, all stats)
   - Saves preferences in local storage

Include unit tests for all new components and functionality. Ensure all interactive elements are accessible and work well on both desktop and mobile devices.

Prompt 9: Predefined Clusters Feature
Let's implement the predefined clusters feature for our NBA comparison app.

Please help me create:

1. A ClusterVisualization component that:
   - Displays predefined player clusters (e.g., "Scoring Guards", "Defensive Centers")
   - Uses an appropriate visualization (scatter plot, grouped lists, etc.)
   - Allows users to select a cluster to see all players in it

2. A ClusterDetail component that:
   - Shows detailed information about a selected cluster
   - Displays average stats for the cluster
   - Lists all players in the cluster with key stats
   - Allows adding players from the cluster to the comparison

3. Connect these components to our existing system:
   - Add a new route for the clusters page
   - Ensure selected players can be carried over to the comparison page

For testing purposes, we can define a few mock clusters. Include unit tests for both components and their integration with the rest of the application.

Prompt 10: Error Handling and Loading States
Let's improve our NBA comparison app by implementing proper error handling and loading states.

Please help me create:

1. A LoadingIndicator component that:
   - Shows an attractive loading animation
   - Can be used throughout the application
   - Has different sizes for different contexts
   - Includes an optional loading message

2. An ErrorMessage component that:
   - Displays user-friendly error messages
   - Includes suggestions for resolving the error when possible
   - Has different severity levels (warning, error, etc.)
   - Optionally includes a retry button

3. Implement error boundaries for:
   - The main application
   - The chart components
   - The data loading process

4. Update our existing components to:
   - Show loading states when data is being fetched
   - Handle and display errors appropriately
   - Gracefully degrade when data is missing or incomplete

Include unit tests for the new components and the error handling functionality. Ensure all error messages are clear and helpful to users.

Prompt 11: Final Integration and Responsive Design
Let's finalize our NBA comparison app by ensuring all components work together seamlessly and the application is fully responsive.

Please help me:

1. Integrate all previously built components into a cohesive application:
   - Ensure the player selection flows into the comparison view
   - Connect the similar players feature with the main comparison
   - Link the clusters page with the player comparison functionality

2. Enhance responsive design:
   - Optimize layouts for mobile, tablet, and desktop
   - Implement specific component variations for different screen sizes
   - Ensure all interactive elements are touch-friendly
   - Test and fix any responsive design issues

3. Add final polish:
   - Implement consistent styling across all components
   - Add subtle animations and transitions for a better user experience
   - Ensure consistent spacing and alignment
   - Optimize performance for larger datasets

4. Create a comprehensive test suite:
   - Add integration tests for key user flows
   - Test responsive behavior
   - Verify all features work together as expected

This should complete our NBA player comparison application with all the features we've discussed.

Prompt 12: Documentation and Deployment Preparation
As the final step for our NBA comparison app, let's prepare documentation and set up the application for deployment.

Please help me create:

1. User documentation:
   - A README.md with project overview and setup instructions
   - In-app help text and tooltips for key features
   - A simple user guide explaining how to use each feature

2. Developer documentation:
   - Component documentation with props and usage examples
   - Data flow diagrams
   - API documentation (for future backend integration)

3. Deployment preparation:
   - Configuration for building the application for production
   - Environment variable setup
   - Performance optimization (code splitting, lazy loading)
   - Basic SEO setup

4. Future development roadmap:
   - Suggestions for moving from CSV to a database
   - Ideas for additional features
   - Performance improvement opportunities

This documentation will ensure both users and future developers can understand and work with our application effectively.
