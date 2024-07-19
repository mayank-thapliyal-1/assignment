import React, { useState } from "react";
const fonts = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];
const App = () => {
  const [elements, setElements] = useState([]);
  const [text, setText] = useState("Add Text");
  const [size, setSize] = useState(16);
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("Arial");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const addElement = () => {
    const newElement = {
      text,
      top: 0,
      left: 0,
      size,
      font,
      color,
      isEditing: false,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    setText("Add Text");
    setHistory([...history, elements]);
    setRedoHistory([]);
  };

  const handleDragStart = (e, index) => {
    const element = elements[index];
    e.dataTransfer.setData("index", index);
    e.dataTransfer.setData("startX", e.clientX - element.left);
    e.dataTransfer.setData("startY", e.clientY - element.top);
  };

  const handleDrag = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    const index = e.dataTransfer.getData("index");
    const startX = parseInt(e.dataTransfer.getData("startX"));
    const startY = parseInt(e.dataTransfer.getData("startY"));
    const updatedElements = [...elements];
    updatedElements[index] = {
      ...updatedElements[index],
      left: e.clientX - startX,
      top: e.clientY - startY,
    };
    setElements(updatedElements);
    setHistory([...history, elements]);
    setRedoHistory([]);
  };
  const undo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setRedoHistory([...redoHistory, elements]);
    setElements(previousState);
    setHistory(history.slice(0, -1));
  };

  const redo = () => {
    if (redoHistory.length === 0) return;
    const nextState = redoHistory[redoHistory.length - 1];
    setHistory([...history, elements]);
    setElements(nextState);
    setRedoHistory(redoHistory.slice(0, -1));
  };

  const handleFontChange = (e) => {
    setFont(e.target.value);
  };
  const toggleEdit = (index) => {
    const updatedElements = [...elements];
    updatedElements[index].isEditing = !updatedElements[index].isEditing;
    setElements(updatedElements);
  };

  const handleTextChange = (e, index) => {
    const updatedElements = [...elements];
    updatedElements[index].text = e.target.value;
    setElements(updatedElements);
   
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSize(newSize);
    if (selectedIndex !== null) {
      const updatedElements = [...elements];
      updatedElements[selectedIndex].size = newSize;
      setElements(updatedElements);
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    if (selectedIndex !== null) {
      const updatedElements = [...elements];
      updatedElements[selectedIndex].color = newColor;
      setElements(updatedElements);
    }
  };

  const handleElementClick = (index) => {
    setSelectedIndex(index);
    const updatedElements = [...elements];
    updatedElements[index].isEditing = true;
    setElements(updatedElements);
  };
  return (
    <div>
      <div className=" flex justify-center m-auto pt-10 p-5  bg-emerald-900 h-screen">
        <div className=" gap-2 ">
          {" "}
          <button
            onClick={redo}
            className=" border p-2 shadow-md bg-green-700 rounded-md text-lg text-white px-5"
          >
            Redo
          </button>
          <button
            onClick={undo}
            className=" border p-2 shadow-md bg-red-700 rounded-md text-lg text-white px-5"
          >
            Undo
          </button>
        </div>
        <div
          className="relative w-full h-[45rem] border bg-slate-300 rounded-md   p-2 flex flex-col justify-start items-center overflow-hidden "
          onDrop={handleDrop}
          onDragOver={handleDrag}
        >
          {elements.map((element, index) => (
            <div
              key={index}
              className="relative  px-10 py-2 text-center  cursor-move onclick"
              style={{
                top: `${element.top}px`,
                left: `${element.left}px`,
                fontSize: `${element.size}px`,
                color: element.color,
                fontFamily: element.font,
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onClick={() => handleElementClick(index)}
            >
              {element.isEditing ? (
                <input
                  type="text"
                  value={element.text}
                  onChange={(e) => handleTextChange(e, index)}
                  onBlur={() => toggleEdit(index)}
                  className="p-1 border border-gray-300 rounded"
                  autoFocus
                />
              ) : (
                element.text
              )}
            </div>
          ))}
        </div>
        <div className=" flex flex-col  p-10 gap-[2rem] ">
          <div className=" flex flex-col  p-2 gap-5">
            <label
              htmlFor=" font"
              className=" text-3xl w-[15rem] font-lighterbold text-slate-300 font-serif "
            >
              {" "}
              Font
            </label>
            <select
              name="fonts"
              id="font"
              value={font}
              onChange={handleFontChange}
              className=" w-[15rem] p-2 bg-slate-200 rounded-md cursor-pointer "
            >
              {fonts.map((fontName) => (
                <option key={fontName} value={fontName}>
                  {fontName}
                </option>
              ))}
            </select>
          </div>

          <div className=" flex  justify-center items-center">
            <div className=" flex flex-col gap-2 ">
              <label
                htmlFor="Size"
                className="text-3xl w-[15rem] font-lighterbold text-slate-300 font-serif"
              >
                Size
              </label>
              <input
                type="number"
                value={size}
                onChange={handleSizeChange}
                placeholder=" Font Size"
                className="w-[5rem]  rounded-lg p-2  font-light text-xl bg-slate-200 "
              />
            </div>
            <div className=" flex flex-col gap-2 ">
              <label
                htmlFor="color"
                className="text-3xl w-[15rem] font-lighterbold text-slate-300 font-serif "
              >
                Color
              </label>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="  p-0  h-[30px] bg-transparent w-[30px] overflow-hidden  "
              />
            </div>
          </div>
          <div className=" relative top-[15rem] cursor-pointer">
            <h1
              className=" border-dashed border-black border px-10 py-2 text-center bg-slate-200"
              onClick={addElement}
            >
              {" "}
              Add Text
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
