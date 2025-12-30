# Interactive Mindmap Visualization

A sophisticated, data-driven mindmap application built with React and D3.js that showcases advanced frontend development capabilities including interactive visualizations, multiple layout modes, and comprehensive user interactions.

## 🎯 Project Overview

This project demonstrates the implementation of a complex, interactive mindmap UI similar to professional visualization tools. It serves as a comprehensive evaluation of frontend development skills including:

- **Complex Interactive UI**: Advanced user interactions with hover, click, and navigation
- **Data-Driven Visualization**: Dynamic rendering from JSON data structures
- **Multiple Layout Algorithms**: Tree and Radial visualization modes
- **Modern Architecture**: Clean, modular, and scalable code structure

## ✨ Features

### 🌟 Core Visualization Features
- **Hierarchical Mindmap Display**: Clear, readable node and connection layouts
- **Dual Layout Modes**: 
  - Tree View: Traditional hierarchical layout
  - Radial View: Circular layout with root at center
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
  children?: MindmapNode[];
  value?: number;
  expanded?: boolean;
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd mindmap-app

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts
```bash
npm start          # Start development server on http://localhost:3000
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App (one-way operation)
```

## 📖 Usage Guide

### Basic Navigation
1. **Hover**: Move cursor over nodes to see preview tooltips
2. **Click**: Select nodes to view detailed information
3. **Drag**: Click and drag to pan around the mindmap
4. **Scroll**: Use mouse wheel to zoom in/out

### Layout Controls
1. **View Toggle**: Switch between Tree and Radial layouts
2. **Expand/Collapse**: Use +/- indicators or control buttons
3. **Quick Actions**: Expand All or Collapse All branches

### Data Customization
Update `src/mindmapData.ts` to modify the mindmap content:
- Add/remove nodes in the hierarchical structure
- Update descriptions and summaries
- Modify node metadata
- Changes reflect automatically in the visualization

## 🎯 Assignment Requirements Fulfilled

### ✅ Functional Requirements
- [x] **Mindmap Visualization**: Hierarchical nodes and connections with clear layout
- [x] **Interactive Features**: Hover, click, expand/collapse, pan, zoom
- [x] **Data Display**: Summary on hover, detailed view in side panel

### ✅ Technical Expectations
- [x] **Modern Framework**: React with TypeScript
- [x] **Visualization Library**: D3.js for complex graphics
- [x] **Clean Code**: Modular, scalable architecture
- [x] **Data-Driven**: JSON-based data structure updates

## 🔧 Development Notes

### Performance Optimizations
- **Efficient Re-rendering**: useCallback for expensive operations
- **Optimized D3 Updates**: Minimal DOM manipulations
- **Memory Management**: Proper cleanup of event listeners
- **Responsive Design**: Adaptive layouts for different screen sizes

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **Component Modularity**: Separation of concerns
- **Error Handling**: Graceful fallbacks and error boundaries
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Deployment

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **D3.js**: For powerful data visualization capabilities
- **React**: For component-based UI development
- **Create React App**: For the project scaffolding and build system

---

**Built as a comprehensive frontend development showcase demonstrating advanced React and D3.js integration.**
