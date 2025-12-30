import React, { useState } from 'react';
import MindmapFixed from './MindmapFixed';
import { sampleMindmapData, MindmapNode } from './mindmapData';
import './App.css';

function App() {
  const [data, setData] = useState<MindmapNode>(sampleMindmapData);
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MindmapNode | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'radial'>('tree');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Interactive Mindmap Visualization</h1>
        <p>Explore the world of vitamins and their role in human health</p>
      </header>
      
      <main className="App-main">
        <div className="controls">
          <button 
            className={`control-btn ${viewMode === 'tree' ? 'active' : ''}`}
            onClick={() => setViewMode('tree')}
          >
            Tree View
          </button>
          <button 
            className={`control-btn ${viewMode === 'radial' ? 'active' : ''}`}
            onClick={() => setViewMode('radial')}
          >
            Radial View
          </button>
        </div>
        
        <div className="mindmap-container">
          <MindmapFixed 
            data={data} 
            width={1200} 
            height={700} 
            layoutType={viewMode}
            onNodeSelect={setSelectedNode}
            onNodeHover={setHoveredNode}
          />
        </div>
        
        <div className="info-panel">
          <h3>Node Details</h3>
          
          {selectedNode ? (
            <div className="node-details">
              <h4>{selectedNode.name}</h4>
              {selectedNode.description && (
                <p className="node-description">
                  <strong>Description:</strong> {selectedNode.description}
                </p>
              )}
              {selectedNode.summary && (
                <p className="node-summary">
                  <strong>Summary:</strong> {selectedNode.summary}
                </p>
              )}
              <div className="node-info">
                <span className="node-id">ID: {selectedNode.id}</span>
                {selectedNode.children && (
                  <span className="node-children">
                    Children: {selectedNode.children.length}
                  </span>
                )}
              </div>
            </div>
          ) : hoveredNode ? (
            <div className="node-details hovered">
              <h4>{hoveredNode.name}</h4>
              {hoveredNode.description && (
                <p className="node-description">
                  {hoveredNode.description}
                </p>
              )}
              <p className="hover-hint">Click to select this node</p>
            </div>
          ) : (
            <div className="empty-state">
              <h4>No Node Selected</h4>
              <p>Hover over nodes to see previews, click to select and view details.</p>
            </div>
          )}
          
          <div className="legend">
            <h4>Node Colors:</h4>
            <div className="legend-item">
              <span className="legend-color root"></span>
              Root Node
            </div>
            <div className="legend-item">
              <span className="legend-color level1"></span>
              Main Categories
            </div>
            <div className="legend-item">
              <span className="legend-color level2"></span>
              Sub-categories
            </div>
            <div className="legend-item">
              <span className="legend-color level3"></span>
              Details
            </div>
          </div>
          
          <div className="instructions">
            <h4>How to Use:</h4>
            <ul>
              <li><strong>Hover:</strong> See node preview in tooltip</li>
              <li><strong>Click:</strong> Select node and view details</li>
              <li><strong>Click +/-:</strong> Expand/collapse branches</li>
              <li><strong>Drag:</strong> Pan around the mindmap</li>
              <li><strong>Scroll:</strong> Zoom in/out</li>
              <li><strong>Controls:</strong> Use buttons for quick actions</li>
              <li><strong>View Modes:</strong> Switch between Tree and Radial layouts</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
