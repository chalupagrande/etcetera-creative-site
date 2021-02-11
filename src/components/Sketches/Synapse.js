import * as THREE from 'three'
import React, { useRef, useEffect, useCallback } from 'react'

function Synapse() {
  let threeMountPoint = useRef(null)

  const memoSketch = useCallback(() => {
    // globals
    let opts = {
      w: 300,
      h: 300,
    }

    let group;
    let particlesData = [];
    let camera, scene, renderer;
    let positions, colors;
    let particles;
    let pointCloud;
    let particlePositions;
    let linesMesh;

    let maxParticleCount = 1000;
    let particleCount = 200;
    let r = 800;
    let rHalf = r / 2;

    let effectController = {
      showDots: true,
      showLines: true,
      minDistance: 150,
      limitConnections: false,
      maxConnections: 80,
      particleCount: 500
    };

    /***
     *
     *
     *
     *
     * SETUP
     */
    function setup(canvas) {
      camera = new THREE.PerspectiveCamera( 45, opts.w / opts.h, 1, 4000 );
      camera.position.z = 1450;
      scene = new THREE.Scene();


      group = new THREE.Group();
      scene.add( group );

      let segments = maxParticleCount * maxParticleCount;

      positions = new Float32Array( segments * 3 );
      colors = new Float32Array( segments * 3 );

      let pMaterial = new THREE.PointsMaterial( {
        color: 0x000000,
        size: 2,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
      } );

      particles = new THREE.BufferGeometry();
      particlePositions = new Float32Array( maxParticleCount * 3 );

      for ( let i = 0; i < maxParticleCount; i ++ ) {

        let x = Math.random() * r - r / 2;
        let y = Math.random() * r - r / 2;
        let z = Math.random() * r - r / 2;

        particlePositions[ i * 3 ] = x;
        particlePositions[ i * 3 + 1 ] = y;
        particlePositions[ i * 3 + 2 ] = z;

        // add it to the geometry
        particlesData.push( {
          velocity: new THREE.Vector3( - 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 ),
          numConnections: 0
        } );

      }

      particles.setDrawRange( 0, particleCount );
      particles.setAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );

      // create the particle system
      pointCloud = new THREE.Points( particles, pMaterial );
      group.add( pointCloud );

      let geometry = new THREE.BufferGeometry();

      geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
      geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );

      geometry.computeBoundingSphere();

      geometry.setDrawRange( 0, 0 );

      let material = new THREE.LineBasicMaterial( {
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true
      } );

      linesMesh = new THREE.LineSegments( geometry, material );
      group.add( linesMesh );

      //

      renderer = new THREE.WebGLRenderer( { antialias: true, canvas, alpha: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( opts.w, opts.h );
      renderer.outputEncoding = THREE.sRGBEncoding;
      //
    }


    function animate() {
      let vertexpos = 0;
      let colorpos = 0;
      let numConnected = 0;

      for ( let i = 0; i < particleCount; i ++ )
        particlesData[ i ].numConnections = 0;

      for ( let i = 0; i < particleCount; i ++ ) {

        // get the particle
        let particleData = particlesData[ i ];

        particlePositions[ i * 3 ] += particleData.velocity.x;
        particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
        particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

        if ( particlePositions[ i * 3 + 1 ] < - rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
          particleData.velocity.y = - particleData.velocity.y;

        if ( particlePositions[ i * 3 ] < - rHalf || particlePositions[ i * 3 ] > rHalf )
          particleData.velocity.x = - particleData.velocity.x;

        if ( particlePositions[ i * 3 + 2 ] < - rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
          particleData.velocity.z = - particleData.velocity.z;

        if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
          continue;

        // Check collision
        for ( let j = i + 1; j < particleCount; j ++ ) {

          let particleDataB = particlesData[ j ];
          if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
            continue;

          let dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ];
          let dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
          let dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
          let dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

          if ( dist < effectController.minDistance ) {

            particleData.numConnections ++;
            particleDataB.numConnections ++;

            let alpha = 1.0 - dist / effectController.minDistance;

            positions[ vertexpos ++ ] = particlePositions[ i * 3 ];
            positions[ vertexpos ++ ] = particlePositions[ i * 3 + 1 ];
            positions[ vertexpos ++ ] = particlePositions[ i * 3 + 2 ];

            positions[ vertexpos ++ ] = particlePositions[ j * 3 ];
            positions[ vertexpos ++ ] = particlePositions[ j * 3 + 1 ];
            positions[ vertexpos ++ ] = particlePositions[ j * 3 + 2 ];

            colors[ colorpos ++ ] = alpha;
            colors[ colorpos ++ ] = alpha;
            colors[ colorpos ++ ] = alpha;

            colors[ colorpos ++ ] = alpha;
            colors[ colorpos ++ ] = alpha;
            colors[ colorpos ++ ] = alpha;

            numConnected ++;

          }

        }

      }

      let ww = window.innerWidth
      let hh = window.innerHeight
      document.addEventListener('mousemove', (e)=> {
        camera.rotation.z = e.pageX / ww / 6
        group.rotation.x = e.pageY / hh / 6
      })



      linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
      linesMesh.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.color.needsUpdate = true;

      pointCloud.geometry.attributes.position.needsUpdate = true;

      requestAnimationFrame( animate );

      render();

    }

    function render() {

      var time = Date.now() * 0.001;

      group.rotation.y = time * 0.1;
      renderer.render( scene, camera );

    }

      /**
     *
     *
     *
     *
     *
     *
     */

    setup(threeMountPoint.current)
    animate()
  }, [threeMountPoint])

  useEffect(() => {
    if (threeMountPoint && threeMountPoint.current) {
      memoSketch()
    }
  }, [threeMountPoint, memoSketch])

  return <canvas ref={threeMountPoint} />
}

export default Synapse
