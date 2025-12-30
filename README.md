# Mindmap Visualization

A clean, interactive mindmap built with React and D3.js. Visualize hierarchical data with smooth interactions and multiple view modes.

## What's Inside

- **Interactive Mindmap**: Click and explore nodes with smooth animations
- **Two View Modes**:
  - Tree View: Classic top-down hierarchy
  - Radial View: Circular layout with root in the center
- **Node Interactions**:
  - Hover to see details
  - Click to expand/collapse branches
  - Pan and zoom to navigate
- **Responsive Design**: Works on different screen sizes
- **Smooth Animations**: Transitions between states and interactions
- **Responsive Design**: Adapts to different screen sizes

### 🎮 Interactive Features
- **Hover Interactions**: Rich tooltips with contextual information
- **Click to Select**: Node selection with visual feedback
- **Expand/Collapse**: Dynamic branch management with +/- indicators
- **Zoom & Pan**: Mouse/touch navigation with intuitive controls
- **Quick Actions**: Expand All, Collapse All buttons

### 📊 Data Display
- **Summary on Hover**: Contextual tooltips showing descriptions and summaries
- **Detailed Side Panel**: Comprehensive node information display
- **Real-time Updates**: Dynamic content updates based on user interactions
- **Node Metadata**: ID tracking, child count, and hierarchical info

## 🏗️ Architecture

### 📁 Project Structure
```
mindmap-app/
├── src/
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   ├── MindmapFixed.tsx     # Enhanced mindmap component
│   ├── mindmapData.ts       # Data structure and sample data
│   └── index.tsx           # Application entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

### 🔧 Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Visualization Library**: D3.js (v7) with d3-hierarchy, d3-zoom
- **Build Tool**: Create React App with Webpack
- **Styling**: CSS3 with modern features
- **Development**: ESLint, TypeScript for code quality

### 📦 Key Dependencies
```json
{
  "react": "^18.2.0",
  "d3": "^7.8.5",
  "typescript": "^4.9.5",
  "@types/d3": "^7.4.3"
}
```

### 🎨 Component Architecture

#### MindmapFixed Component
- **State Management**: React hooks for local state
- **D3 Integration**: Efficient DOM manipulation
- **Layout Algorithms**: Tree and Radial implementations
- **Event Handling**: Mouse, touch, and keyboard interactions
- **Performance**: Optimized re-rendering with useCallback

#### Data Structure
```typescript
interface MindmapNode {
  id: string;
  name: string;
  description?: string;
  summary?: string;
1. **Hover**: Move cursor over nodes to see preview tooltips
2. **Click**: Select nodes to view detailed information
3. **Drag**: Click and drag to pan around the mindmap
4. **Scroll**: Use mouse wheel to zoom in/out

## Deployment

### Production Build
```bash
npm run build
```
The build will be created in the `build/` folder and can be deployed to any static hosting service.

### Environment Variables
Create a `.env` file for environment-specific configurations:
```env
REACT_APP_API_URL=your-api-endpoint
REACT_APP_TITLE=Your App Title
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **D3.js**: For powerful data visualization capabilities
- **React**: For component-based UI development
- **Create React App**: For the project scaffolding and build system

---

**Built as a comprehensive frontend development showcase demonstrating advanced React and D3.js integration.**
