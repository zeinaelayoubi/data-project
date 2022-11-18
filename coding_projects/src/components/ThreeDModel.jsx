import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useGLTF, Environment, OrbitControls, ContactShadows, SpotLight } from "@react-three/drei";
import { proxy, useSnapshot} from 'valtio'
import { HexColorPicker } from "react-colorful";

const state = proxy({
  current : null,
  items : {
    shoe: "#ff0000",
  }
})


function Picker() {
  const snap = useSnapshot(state)
  return (
    <div style = {{display : snap.current ? "block" : "none"}}>
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
      <h1>{snap.current}</h1>
    </div>
  )
}

function ThreeDModel() {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF('/shoe.gltf')
  const [ meshes, setMeshes ] = useState(() => [
    { id: "laces", geometry: nodes.shoe_7.geometry, material: materials.laces, materialColor: snap.items.laces },
    { id: "inner", geometry: nodes.shoe_6.geometry, material: materials.inner, materialColor: snap.items.inner },
    { id: "patch", geometry: nodes.shoe_5.geometry, material: materials.patch, materialColor: snap.items.patch },
    { id: "caps", geometry: nodes.shoe_4.geometry, material: materials.caps, materialColor: snap.items.caps },
    { id: "band", geometry: nodes.shoe_3.geometry, material: materials.band, materialColor: snap.items.band },
    { id: "stripes", geometry: nodes.shoe_2.geometry, material: materials.stripes, materialColor: snap.items.stripes },
    { id: "sole", geometry: nodes.shoe_1.geometry, material: materials.sole, materialColor: snap.items.sole },
    { id: "mesh", geometry: nodes.shoe.geometry, material: materials.mesh, materialColor: snap.items.mesh },
  ])

  const removeMeshById = useCallback((id) => {
    setMeshes((meshes) => meshes.filter((mesh) => mesh.id !== id));
  }, []);

  const addMesh = useCallback((mesh) => {
    setMeshes((meshes) => [...meshes, mesh]);
  }, []);

   const [hovered, setHover] = useState(null)
  useEffect(() => {
    meshes.forEach((mesh) => {
      mesh.material.color.set(snap.items[mesh.id])
    })
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
    document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(hovered ? cursor : auto)}'), auto`
  }, [snap.items, snap.color, hovered])
  
  return (
    <>
    <div>
      <Picker />
      <Canvas camera={{ fov: 40 }}>
        <ambientLight intensity={1.25} />
        <SpotLight intensity={0.3} position = {[15,20,20]} />
        <Suspense fallback={null}>
        <group {...meshes} dispose={null}
          onPointerDown = {(e) => (e.stopPropagation(), state.current = e.object.material.name)}
          onPointerMissed = {(e) => (state.current = null)}
        >
          {meshes.map((mesh) => (
            <mesh
              key={mesh.id}
              geometry={mesh.geometry}
              material={mesh.material}
              materialColor={mesh.materialColor}
            />
          ))}
        </group>
        </Suspense>
        <Environment files= "royal_esplanade_1k.hdr" />
        <ContactShadows rotation-x={Math.PI / 2} position={[0, -0.8, 0]} opacity={0.25} width={10} height={10} blur={1.5} far={0.8} />
        <OrbitControls />
      </Canvas>
      </div>
    </>
  );
}

export default ThreeDModel;