// src/pages/PublishedPortfolio.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BLOCKS } from "../BlockRegistry";
import "../styles/PublishedPortfolio.css";

export default function PublishedPortfolio() {
  const { portfolioId } = useParams();
  const [elements, setElements] = useState([]);
  const [canvasHeight, setCanvasHeight] = useState(1200);
  const [canvasBackground, setCanvasBackground] = useState("#ffffff");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        console.log("Fetching portfolio with ID:", portfolioId);
        
        // Fetch public portfolio data (no auth required for published portfolios)
        const res = await fetch(
          `http://localhost:4322/portfolio/public/${portfolioId}`
        );
        
        if (!res. ok) {
          if (res.status === 404) {
            throw new Error("Portfolio not found or not published");
          }
          throw new Error(`Server error: ${res.status}`);
        }

        const text = await res.text();
        if (! text) throw new Error("Empty response");

        const data = JSON.parse(text);
        
        console.log("Portfolio data received:", data);
        console.log("Elements:", data?. elements);
        
        setPortfolioData(data);
        setElements(data?.elements || []);
        
        if (data. canvas?. height) setCanvasHeight(data.canvas. height);
        if (data.canvas?.background) setCanvasBackground(data.canvas.background);
        
        // Set page title if portfolio has a name
        if (data.name) {
          document.title = `${data.name} - Portfolio`;
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="published-loading">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="published-error">
        <div className="error-content">
          <h2>⚠️ Portfolio Not Found</h2>
          <p>{error}</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
            This portfolio may not exist or hasn't been published yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="published-portfolio">
      <div
        className="published-canvas"
        style={{
          minHeight: canvasHeight,
          backgroundColor: canvasBackground,
          position: 'relative',  // IMPORTANT: Add relative positioning
        }}
      >
        <div className="published-content" style={{
          position: 'relative',  // IMPORTANT:  Ensure elements can be absolutely positioned
          width: '100%',
          height: '100%',
          minHeight: canvasHeight
        }}>
          {elements.length === 0 ? (
            <div className="empty-portfolio">
              <p>This portfolio is empty</p>
            </div>
          ) : (
            elements. map((el) => {
              const cfg = BLOCKS[el.type];
              const Block = cfg?. Render;

              // Debug logging
              if (! Block) {
                console.warn(`No Render component found for block type: ${el.type}`);
              }

              return (
                <div
                  key={el.id}
                  className="published-element"
                  style={{
                    position: 'absolute',
                    left: el.x || 0,
                    top:  el.y || 0,
                    width: el.width || 200,
                    height: el. height || 100,
                    overflow: 'hidden',
                  }}
                >
                  {Block ? (
                    <Block
                      element={el}
                      update={() => {}} // No updates in published view
                      openModal={() => {}} // No modals in published view
                      readOnly={true}
                    />
                  ) : (
                    <div className="unknown-block">
                      Unknown block type: {el.type}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Optional: Add a subtle footer with branding */}
      <div className="published-footer">
        <p>Powered by Portfolio Builder</p>
      </div>
    </div>
  );
}