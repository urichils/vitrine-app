// src/pages/PublishedPortfolio. jsx
import React, { useState, useEffect, useRef } from "react";
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
  const [canvasWidth, setCanvasWidth] = useState(1400);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setCanvasWidth(contentRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(
          `http://localhost:4322/portfolio/public/${portfolioId}`
        );
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Portfolio not found or not published");
          }
          throw new Error(`Server error: ${res.status}`);
        }

        const text = await res.text();
        if (! text) throw new Error("Empty response");

        const data = JSON.parse(text);
        
        setPortfolioData(data);
        setElements(data?. elements || []);
        
        if (data. canvas?. height) setCanvasHeight(data.canvas. height);
        if (data.canvas?.background) setCanvasBackground(data.canvas.background);
        
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

  // Calculate scale factor for responsive positioning
  const DESIGN_WIDTH = 1400;
  const scaleX = canvasWidth / DESIGN_WIDTH;

  return (
    <div className="published-portfolio">
      <div
        className="published-canvas"
        style={{
          minHeight: canvasHeight,
          backgroundColor: canvasBackground,
          position: 'relative',
        }}
      >
        <div 
          ref={contentRef}
          className="published-content"
          style={{
            position: 'relative',
            width: '100%',
            minHeight: canvasHeight,
            maxWidth: '1400px',
            margin: '0 auto'
          }}
        >
          {elements.length === 0 ? (
            <div className="empty-portfolio">
              <p>This portfolio is empty</p>
            </div>
          ) : (
            elements.map((el) => {
              const cfg = BLOCKS[el.type];
              const Block = cfg?. Render;

              if (! Block) {
                console.warn(`No Render component found for block type: ${el.type}`);
              }

              return (
                <div
                  key={el.id}
                  className="published-element"
                  style={{
                    position: 'absolute',
                    left: el.x * scaleX,
                    top: el.y,
                    width: el.width * scaleX,
                    height: el.height,
                    pointerEvents: 'auto',
                    transform: `scale(${scaleX})`,
                    transformOrigin: 'top left'
                  }}
                >
                  {Block ? (
                    <Block
                      element={el}
                      update={() => {}}
                      openModal={() => {}}
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

      <div className="published-footer">
        <p>Powered by <span className="gradient-text">Vitrine</span></p>
      </div>
    </div>
  );
}