// src/components/AuthDebugHelper.jsx
// This is a temporary component to help debug auth issues

import React from 'react';
import { useAuth } from '../context/authContext';

export default function AuthDebugHelper() {
  const { user, isAuthenticated } = useAuth();

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div></div>
    // <div style={{
    //   position: 'fixed',
    //   bottom: 10,
    //   left: 10,
    //   background: '#1f2937',
    //   color: 'white',
    //   padding: '12px',
    //   borderRadius: '8px',
    //   fontSize: '12px',
    //   fontFamily: 'monospace',
    //   maxWidth: '400px',
    //   zIndex: 9999,
    //   boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    // }}>
    //   <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#10b981' }}>
    //     🔍 Auth Debug Info
    //   </div>
    //   <div style={{ marginBottom: '4px' }}>
    //     <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
    //   </div>
    //   <div style={{ marginBottom: '4px' }}>
    //     <strong>User ID:</strong> {user?.id || 'N/A'}
    //   </div>
    //   <div style={{ marginBottom: '4px' }}>
    //     <strong>Username:</strong> {user?.username || 'N/A'}
    //   </div>
    //   <div style={{ marginBottom: '4px' }}>
    //     <strong>Token exists:</strong> {user?.token ? '✅ Yes' : '❌ No'}
    //   </div>
    //   {user?.token && (
    //     <div style={{ marginBottom: '4px' }}>
    //       <strong>Token (first 20):</strong> {user.token.substring(0, 20)}...
    //     </div>
    //   )}
    //   <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #374151' }}>
    //     <button
    //       onClick={() => {
    //         console.log('=== FULL USER OBJECT ===');
    //         console.log(user);
    //         console.log('=== LOCAL STORAGE ===');
    //         console.log(localStorage.getItem('user'));
    //       }}
    //       style={{
    //         background: '#3b82f6',
    //         color: 'white',
    //         border: 'none',
    //         padding: '4px 8px',
    //         borderRadius: '4px',
    //         cursor: 'pointer',
    //         fontSize: '11px'
    //       }}
    //     >
    //       Log Full Details
    //     </button>
    //   </div>
    // </div>
  );
}