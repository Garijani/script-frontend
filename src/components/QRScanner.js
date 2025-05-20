// // // // // frontend/src/components/QRScanner.js
// // // // import React, { useEffect, useRef, useState } from 'react';
// // // // import { Html5Qrcode } from 'html5-qrcode';

// // // // export default function QRScanner({ onScan, fps = 10, qrbox = 250 }) {
// // // //   const [error, setError] = useState(null);
// // // //   const scannerRef = useRef();

// // // //   useEffect(() => {
// // // //     const scanner = new Html5Qrcode("qr-reader");
// // // //     scannerRef.current = scanner;

// // // //     scanner
// // // //       .start(
// // // //         { facingMode: "environment" },
// // // //         { fps, qrbox },
// // // //         (decoded) => onScan(decoded),
// // // //         (err) => setError(err)
// // // //       )
// // // //       .catch(e => setError(e));

// // // //     return () => {
// // // //       scannerRef.current?.stop().catch(() => {});
// // // //     };
// // // //   }, [onScan, fps, qrbox]);

// // // //   return (
// // // //     <div>
// // // //       <div id="qr-reader" style={{ width: "100%" }} />
// // // //       {error && <div style={{ color: "red" }}>Scan error: {error.message}</div>}
// // // //     </div>
// // // //   );
// // // // }


// // // import React, { useEffect, useRef, useState } from 'react';
// // // import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

// // // export default function QRScanner({ onScan, fps = 10, qrbox = 250 }) {
// // //   const [error, setError] = useState(null);
// // //   const scannerRef = useRef(null);
// // //   const containerId = "qr-reader";

// // //   useEffect(() => {
// // //     const scanner = new Html5Qrcode(containerId);
// // //     scannerRef.current = scanner;

// // //     scanner
// // //       .start(
// // //         { facingMode: "environment" },
// // //         { fps, qrbox },
// // //         (decodedText) => onScan(decodedText),
// // //         (scanError) => {
// // //           // Not critical: scanning errors happen frequently during scanning
// // //         }
// // //       )
// // //       .catch(err => {
// // //         console.error("Scanner start error:", err);
// // //         setError(err);
// // //       });

// // //     return () => {
// // //       // Cleanup: stop scanner only if it's running
// // //       if (scannerRef.current) {
// // //         scannerRef.current.getState().then(state => {
// // //           if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
// // //             scannerRef.current.stop().catch(() => {});
// // //           }
// // //         }).catch(() => {});
// // //       }
// // //     };
// // //   }, [onScan, fps, qrbox]);

// // //   return (
// // //     <div>
// // //       <div id={containerId} style={{ width: "100%" }} />
// // //       {error && <div style={{ color: "red" }}>Scan error: {error.message || String(error)}</div>}
// // //     </div>
// // //   );
// // // }


// // // frontend/src/components/QRScanner.js
// // import React, {
// //     useEffect,
// //     useRef,
// //     useState,
// //     forwardRef,
// //     useImperativeHandle,
// //   } from 'react';
// //   import { Html5Qrcode } from 'html5-qrcode';
  
// //   const QRScanner = forwardRef(({ onScan, fps = 10, qrbox = 250 }, ref) => {
// //     const scannerRef = useRef(null);
// //     const containerId = 'qr-reader';
// //     const [error, setError] = useState(null);
  
// //     // Expose start/stop to parent via ref
// //     useImperativeHandle(ref, () => ({
// //       start: () => {
// //         if (!scannerRef.current) {
// //           scannerRef.current = new Html5Qrcode(containerId);
// //         }
  
// //         scannerRef.current
// //           .start(
// //             { facingMode: 'environment' },
// //             { fps, qrbox },
// //             (decoded) => onScan(decoded),
// //             (scanError) => {
// //               // Scanning errors can be frequent, no need to display them
// //             }
// //           )
// //           .catch((err) => {
// //             console.error('Start failed:', err);
// //             setError(err);
// //           });
// //       },
// //       stop: () => {
// //         scannerRef.current?.stop().catch(() => {});
// //       },
// //     }));
  
// //     useEffect(() => {
// //       return () => {
// //         // Ensure scanner is stopped on unmount
// //         scannerRef.current?.stop().catch(() => {});
// //       };
// //     }, []);
  
// //     return (
// //       <div>
// //         <div id={containerId} style={{ width: '100%' }} />
// //         {error && (
// //           <div style={{ color: 'red' }}>
// //             Scan error: {error.message || String(error)}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   });
  
// //   export default QRScanner;
  
// // frontend/src/components/QRScanner.js
// import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';

// const QRScanner = forwardRef(({ onScan, fps = 10, qrbox = 250 }, ref) => {
//   const scannerRef = useRef(null);
//   const isScanningRef = useRef(false);
//   const containerId = 'qr-reader';
//   const [error, setError] = useState(null);

//   useImperativeHandle(ref, () => ({
//     start: () => {
//       if (!scannerRef.current) {
//         scannerRef.current = new Html5Qrcode(containerId);
//       }

//       if (!isScanningRef.current) {
//         scannerRef.current.start(
//           { facingMode: "environment" },
//           { fps, qrbox },
//           (decodedText) => onScan(decodedText),
//           () => {}
//         ).then(() => {
//           isScanningRef.current = true;
//         }).catch(err => {
//           console.error('Scanner start error:', err);
//           setError(err);
//         });
//       }
//     },

//     stop: () => {
//       if (scannerRef.current && isScanningRef.current) {
//         scannerRef.current.stop().then(() => {
//           isScanningRef.current = false;
//         }).catch(err => {
//           console.warn('Scanner stop error (ignored):', err.message);
//         });
//       }
//     }
//   }));

//   useEffect(() => {
//     return () => {
//       if (scannerRef.current && isScanningRef.current) {
//         scannerRef.current.stop().then(() => {
//           isScanningRef.current = false;
//         }).catch(() => {});
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <div id={containerId} style={{ width: '100%' }} />
//       {error && (
//         <div style={{ color: 'red' }}>
//           Scan error: {error.message || String(error)}
//         </div>
//       )}
//     </div>
//   );
// });

// export default QRScanner;


import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
  } from 'react';
  import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
  
  const QRScanner = forwardRef(({ onScan, fps = 10, qrbox = 250 }, ref) => {
    const scannerRef = useRef(null);
    const isReady = useRef(false);
    const containerId = 'qr-reader';
    const [error, setError] = useState(null);
  
    useImperativeHandle(ref, () => ({
      start: async () => {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(containerId);
        }
  
        try {
          const state = scannerRef.current.getState();
          if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.STARTING) {
            console.log('Scanner already starting or running');
            return;
          }
  
          await scannerRef.current.start(
            { facingMode: 'environment' },
            { fps, qrbox },
            (decodedText) => onScan(decodedText),
            (scanError) => {}
          );
          isReady.current = true;
        } catch (err) {
          console.error('Failed to start scanner:', err);
          setError(err);
        }
      },
  
      stop: async () => {
        if (scannerRef.current) {
          const state = scannerRef.current.getState();
          if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
            try {
              await scannerRef.current.stop();
              isReady.current = false;
            } catch (err) {
              console.warn('Failed to stop scanner (harmless):', err);
            }
          } else {
            console.log('Stop skipped: scanner not running');
          }
        }
      },
    }));
  
    useEffect(() => {
      return () => {
        if (scannerRef.current && isReady.current) {
          scannerRef.current.stop().catch(() => {});
        }
      };
    }, []);
  
    return (
      <div>
        <div id={containerId} style={{ width: '100%' }} />
        {error && (
          <div style={{ color: 'red' }}>
            Camera error: {error.message || String(error)}
          </div>
        )}
      </div>
    );
  });
  
  export default QRScanner;
  