(() => {
  // widget-src/code.tsx
  var { widget } = figma;
  var { AutoLayout, SVG, Text, Image, Frame, Line, Rectangle, Ellipse, useSyncedState, usePropertyMenu, Input, useEffect, waitForTask } = widget;
  var App = () => {
    const [background, setBackground] = useSyncedState("background", "https://raw.githubusercontent.com/kakax114/Figma-Widget-Mindmap/main/background-light.png");
    const [strokeColor, setStrokeColor] = useSyncedState("strokeColor", "#ffffff");
    const [rgb, setRgb] = useSyncedState("rgb", [0.48, 0.92, 0.67, 0.47, 0.85, 0.39]);
    const [fontColor, setFontColor] = useSyncedState("fontColor", "#ffffff");
    const [lineColor, setLineColor] = useSyncedState("lineColor", "#6DDC93");
    const [data, setData] = useSyncedState("data", [
      [
        {
          id: "a",
          text: "",
          linkTo: "-"
        }
      ]
    ]);
    usePropertyMenu([
      {
        itemType: "dropdown",
        propertyName: "Background",
        selectedOption: background === "https://raw.githubusercontent.com/kakax114/Figma-Widget-Mindmap/main/background-light.png" ? "light" : "dark",
        tooltip: "Change the background color",
        options: [
          { option: "light", label: "Light" },
          { option: "dark", label: "Dark" }
        ]
      },
      {
        itemType: "color-selector",
        propertyName: "colors",
        tooltip: "Note color",
        selectedOption: rgb[0] === 0.48 ? "#78D965" : rgb[0] === 0.55 ? "#6F66EE" : rgb[0] === 0.97 ? "#F9DB57" : rgb[0] === 0.24 ? "#3F474C" : rgb[0] === 0.95 ? "#ffffff" : "#ffffff",
        options: [{ option: "#78D965", tooltip: "Lime" }, { option: "#6F66EE", tooltip: "Jacaranda" }, { option: "#F9DB57", tooltip: "Mustard" }, { option: "#3F474C", tooltip: "Coal" }, { option: "#FFF", tooltip: "Snow" }]
      },
      {
        itemType: "action",
        propertyName: "Export",
        tooltip: "Export"
      }
    ], ({ propertyName, propertyValue }) => {
      if (propertyName === "Background") {
        if (propertyValue === "light") {
          setBackground("https://raw.githubusercontent.com/kakax114/Figma-Widget-Mindmap/main/background-light.png");
          if (rgb[0] != 1) {
            setStrokeColor("#ffffff");
          }
        } else {
          setBackground("https://raw.githubusercontent.com/kakax114/Figma-Widget-Mindmap/main/background-dark.png");
          setStrokeColor("#212226");
        }
      }
      if (propertyName === "colors") {
        console.log(propertyValue);
        if (propertyValue === "#78D965") {
          setRgb([0.48, 0.9, 0.5, 0.47, 0.85, 0.39]);
          setFontColor("#ffffff");
          setLineColor("#6DDC93");
          if (background === "https://raw.githubusercontent.com/kakax114/Figma-Widget-Mindmap/main/background-light.png") {
            setStrokeColor("#ffffff");
          } else {
            setStrokeColor("#212226");
          }
        } else if (propertyValue === "#6F66EE") {
          setRgb([0.55, 0.4, 0.96, 0.39, 0.35, 0.85]);
          setFontColor("#ffffff");
          setLineColor("#B18CED");
          if (background === "https://raw.githubusercontent.com/kakax114/Figma-Widget-Mindmap/main/background-light.png") {
            setStrokeColor("#ffffff");
          } else {
            setStrokeColor("#212226");
          }
        } else if (propertyValue === "#F9DB57") {
          setRgb([0.97, 0.8, 0.4, 0.95, 0.73, 0.35]);
          setFontColor("#3F474C");
          setLineColor("#FF971D");
          if (background === "https://raw.githubusercontent.com/kakax114/Figma-Widget-Mindmap/main/background-light.png") {
            setStrokeColor("#ffffff");
          } else {
            setStrokeColor("#212226");
          }
        } else if (propertyValue === "#3F474C") {
          console.log("coal");
          setRgb([0.24, 0.27, 0.29, 0.22, 0.25, 0.27]);
          setFontColor("#ffffff");
          setLineColor("#CEC0CF");
          if (background === "https://raw.githubusercontent.com/kakax114/Figma-Widget-Mindmap/main/background-light.png") {
            setStrokeColor("#ffffff");
          } else {
            setStrokeColor("#212226");
          }
        } else if (propertyValue === "#FFF") {
          console.log("snow");
          setRgb([0.95, 0.95, 0.95, 0.95, 0.95, 0.95]);
          setFontColor("#3F474C");
          setLineColor("#CEC0CF");
          setStrokeColor("#ffffff");
        }
      }
      if (propertyName === "Export") {
        return new Promise((resolve) => {
          figma.showUI(exportMindmap(), { title: "Copy to clipbord" });
        });
      }
    });
    const exportMindmap = () => {
      const dataCopy = JSON.parse(JSON.stringify(data));
      const dataCopyMerged = [];
      for (let i = 0; i < dataCopy.length; i++) {
        for (let j = 0; j < dataCopy[i].length; j++) {
          dataCopyMerged.push(dataCopy[i][j]);
        }
      }
      for (let i = 0; i < dataCopyMerged.length; i++) {
        if (dataCopyMerged[i].linkTo === "-" && dataCopyMerged[i].id != "a") {
          dataCopyMerged.splice(i, 1);
          i--;
        }
      }
      dataCopyMerged.sort((a, b) => a.id.localeCompare(b.id));
      let outputString = `${dataCopyMerged[0].text}
`;
      for (let i = 1; i < dataCopyMerged.length; i++) {
        let spaces = "";
        for (let j = 0; j < dataCopyMerged[i].id.length - 2; j++) {
          spaces += " ";
        }
        outputString += `${spaces}${dataCopyMerged[i].text}
`;
      }
      console.log("<pre>" + outputString + "</pre>");
      return "<pre>" + outputString + "</pre>";
    };
    const getXPos = () => {
      return 100;
    };
    const getYPos = () => {
      return 50;
    };
    const groupIndex = (id) => {
      return data.findIndex((group) => group.some((item) => item.id === id));
    };
    const itemIndex = (id) => {
      try {
        return data[groupIndex(id)].findIndex((item) => item.id === id);
      } catch (e) {
        return 0;
      }
    };
    const getLinkTo = (id) => {
      return data[groupIndex(id)][itemIndex(id)].linkTo;
    };
    const getChildID = (id) => {
      return id + "01";
    };
    const getSiblingID = (id) => {
      let prefix = id.slice(0, -2);
      let lastNumber = parseInt(id.slice(-2));
      if (lastNumber < 9) {
        return prefix + "0" + (lastNumber + 1);
      } else {
        return prefix + (lastNumber + 1);
      }
    };
    const decreamentID = (id) => {
      let prefix = id.slice(0, -2);
      let lastNumber = parseInt(id.slice(-2));
      return prefix + "0" + (lastNumber - 1);
    };
    const getBiggestChild = (id) => {
      let items = data[groupIndex(id) + 1].filter((item) => item.linkTo === id);
      return items.sort((a, b) => a.id.localeCompare(b.id)).pop().id;
    };
    const emptyItem = () => {
      return {
        id: "-",
        text: "-",
        linkTo: "-"
      };
    };
    const addChild = (id) => {
      console.log(groupIndex(id), itemIndex(id));
      if (!data[groupIndex(id) + 1]) {
        let newGroup = [];
        for (let i = 0; i < data[0].length; i++) {
          newGroup.push(emptyItem());
        }
        newGroup[itemIndex(id)] = {
          id: getChildID(id),
          text: "",
          linkTo: id
        };
        setData([...data, newGroup]);
      } else if (data[groupIndex(id) + 1][itemIndex(id)].id === "-") {
        data[groupIndex(id) + 1][itemIndex(id)] = {
          id: getChildID(id),
          text: "",
          linkTo: id
        };
        setData([...data]);
      } else {
        let newID = getBiggestChild(id);
        addSibling(newID, getLinkTo(newID), groupIndex(newID), itemIndex(newID));
      }
    };
    const clearEmptyRowCol = (newData) => {
      for (let k = 0; k < 5; k++) {
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].every((item) => item.id === "-")) {
            newData.splice(i, 1);
          }
        }
        for (let i = 0; i < newData[0].length; i++) {
          try {
            if (newData.every((group) => group[i].id === "-")) {
              for (let j = 0; j < newData.length; j++) {
                newData[j].splice(i, 1);
              }
            }
          } catch (e) {
          }
        }
      }
      setData(newData);
    };
    const simpleDelete = (id) => {
      console.log("simple delete");
      let items = [];
      let newData = [...data];
      for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < newData[i].length; j++) {
          if (newData[i][j].id.includes(id)) {
            items.push(newData[i][j]);
            newData[i][j] = emptyItem();
          }
        }
      }
      console.log(items);
      clearEmptyRowCol(newData);
    };
    const drawLine = (id, itemIndex2) => {
      try {
        if (id !== "-" && data[groupIndex(id) + 1][itemIndex2].linkTo !== "-") {
          let idPosition = itemIndex2;
          let cardHeight = 150;
          const defaultLineLength = 50;
          let children = data[groupIndex(id) + 1].filter((item) => item.linkTo === id);
          let childIndex = children.map((child) => data[groupIndex(id) + 1].indexOf(child));
          console.log("origin: " + parseInt(idPosition * cardHeight + cardHeight / 2));
          let diagonalLines = [];
          for (let i = 0; i < children.length; i++) {
            diagonalLines.push(Math.sqrt(Math.pow(defaultLineLength, 2) + Math.pow((childIndex[i] - idPosition) * cardHeight, 2)));
          }
          let angles = [];
          for (let i = 0; i < children.length; i++) {
            angles.push(-(Math.atan((childIndex[i] - idPosition) * cardHeight / defaultLineLength) * 180 / Math.PI));
          }
          let lines = [];
          for (let i = 0; i < children.length; i++) {
            console.log("child: " + children[i].id, "index: " + childIndex[i], "line: " + diagonalLines[i], "angle: " + angles[i]);
            lines.push(/* @__PURE__ */ figma.widget.h(Line, {
              x: 100,
              y: 75,
              length: diagonalLines[i],
              rotation: angles[i],
              stroke: lineColor,
              strokeWidth: 4,
              opacity: 0.5,
              strokeCap: "round"
            }));
          }
          return lines;
        }
      } catch (e) {
      }
    };
    const deleteItem = (id, linkTo, groupIndex2, itemIndex2) => {
      let newData = [...data];
      let moveBy = 1;
      if (id.slice(-2) === "01") {
        for (let i = itemIndex2 + 1; i < newData[groupIndex2].length; i++) {
          if (newData[groupIndex2][i].id === "-") {
            moveBy++;
          } else {
            break;
          }
        }
      }
      let lastItem = true;
      if (itemIndex2 === data[groupIndex2].length - 1) {
        lastItem = true;
      } else {
        for (let i = itemIndex2 + 1; i < data[groupIndex2].length; i++) {
          if (data[groupIndex2][i].id !== "-") {
            lastItem = false;
          }
        }
      }
      if (lastItem) {
        simpleDelete(id);
      } else {
        console.log("advanced delete");
        console.log(id, groupIndex2, itemIndex2);
        for (let i = 0; i < newData.length; i++) {
          for (let j = 0; j < newData[i].length; j++) {
            if (newData[i][j].id.includes(id)) {
              newData[i][j] = emptyItem();
            }
          }
        }
        let changedItems = [];
        let items = newData[groupIndex2].slice(itemIndex2 + 1);
        items = items.filter((item) => item.id !== "-" && item.linkTo === linkTo);
        console.log("items to decrement");
        console.log(items);
        if (items.length === 1) {
          let item = JSON.parse(JSON.stringify(items[0]));
          for (let i = groupIndex2; i < newData.length; i++) {
            console.log("scanned through group: " + newData[i]);
            for (let j = 0; j < newData[i].length; j++) {
              console.log("taking " + item.id + " scanned through item: " + newData[i][j].id);
              if (newData[i][j].id.includes(item.id)) {
                let tempID = "";
                console.log("old id: " + newData[i][j].id);
                tempID = newData[i][j].id.replace(item.id, decreamentID(item.id));
                console.log("new id: " + tempID);
                newData[i][j].id = tempID;
                changedItems.push({ item: newData[i][j], col: i, rol: j });
              }
              if (newData[i][j].linkTo.includes(item.id)) {
                newData[i][j].linkTo = newData[i][j].linkTo.replace(item.id, decreamentID(item.id));
              }
            }
          }
        } else {
          items.forEach((item) => {
            for (let i = groupIndex2; i < newData.length; i++) {
              console.log("scanned through group: " + newData[i]);
              for (let j = 0; j < newData[i].length; j++) {
                console.log("taking " + item.id + " scanned through item: " + newData[i][j].id);
                if (newData[i][j].id.includes(item.id)) {
                  let tempID = "";
                  console.log("old id: " + newData[i][j].id);
                  tempID = newData[i][j].id.replace(item.id, decreamentID(item.id));
                  console.log("new id: " + tempID);
                  newData[i][j].id = tempID;
                  changedItems.push({ item: newData[i][j], col: i, rol: j });
                }
                if (newData[i][j].linkTo.includes(item.id)) {
                  newData[i][j].linkTo = newData[i][j].linkTo.replace(item.id, decreamentID(item.id));
                }
              }
            }
          });
        }
        changedItems.sort((a, b) => {
          if (a.rol < b.rol) {
            return -1;
          } else if (a.rol > b.rol) {
            return 1;
          } else {
            if (a.col < b.col) {
              return -1;
            } else if (a.col > b.col) {
              return 1;
            } else {
              return 0;
            }
          }
        });
        for (let i = 0; i < changedItems.length; i++) {
          for (let j = 0; j < newData.length; j++) {
            for (let k = 0; k < newData[j].length; k++) {
              if (newData[j][k].id === changedItems[i].item.id) {
                console.log("move item: " + newData[j][k].id + " from " + k + " to " + (k - moveBy));
                newData[j][k - moveBy] = changedItems[i].item;
                newData[j][k] = emptyItem();
              }
            }
          }
        }
        console.log("changed items");
        console.log(changedItems);
        clearEmptyRowCol(newData);
      }
    };
    const addRow = () => {
      let newData = [...data];
      newData.forEach((group) => {
        group.push(emptyItem());
      });
      return newData;
    };
    const biggestIndex = (id) => {
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        let tempID = "";
        for (let j = 0; j < data[i].length; j++) {
          if (data[i][j].id.includes(id)) {
            tempID = data[i][j].id;
          }
        }
        console.log("id index: " + tempID);
        temp.push(itemIndex(tempID));
      }
      console.log("compare depth:" + temp);
      return Math.max(...temp);
    };
    const addSibling = (id, linkTo, groupIndex2, itemIndex2) => {
      console.log("add sibling from: " + id);
      let newData = addRow();
      let addToIndex = biggestIndex(id) + 1;
      let items = newData[groupIndex2].slice(addToIndex, -1);
      items = items.filter((item) => item.id !== "-");
      items.forEach((item) => {
        for (let i = newData.length - 1; i >= 0; i--) {
          for (let j = newData[i].length - 2; j >= addToIndex; j--) {
            if (newData[i][j].id.includes(item.id)) {
              newData[i][j].id = newData[i][j].id.replace(item.id, getSiblingID(item.id));
            }
            if (newData[i][j].linkTo.includes(item.id)) {
              newData[i][j].linkTo = newData[i][j].linkTo.replace(item.id, getSiblingID(item.id));
            }
          }
        }
      });
      for (let i = newData.length - 1; i >= 0; i--) {
        for (let j = newData[i].length - 2; j >= addToIndex; j--) {
          newData[i][j + 1] = newData[i][j];
          newData[i][j] = emptyItem();
        }
      }
      newData[groupIndex2][addToIndex] = {
        id: getSiblingID(id),
        text: "",
        linkTo
      };
      setData(newData);
      console.log(items);
      console.log("insert at: " + addToIndex);
      console.log(newData);
    };
    const getFontSize = () => {
      if (text.length > 10 && text.length < 20) {
        return 20;
      } else if (text.length > 20) {
        return 10;
      } else {
        return 11;
      }
    };
    const buttonSvgSrc = `
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15.5" fill="#F3F3F4"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17 8H15V15H8V17H15V24H17V17H24V15H17V8Z" fill="#000000" fill-opacity="0.4"/>
    </svg>
  `;
    return /* @__PURE__ */ figma.widget.h(AutoLayout, {
      direction: "horizontal",
      fill: {
        type: "image",
        src: background,
        scaleMode: "tile",
        scalingFactor: 0.1
      },
      cornerRadius: 20,
      padding: 5
    }, data.map((group, i) => {
      return /* @__PURE__ */ figma.widget.h(AutoLayout, {
        key: i,
        name: "column",
        direction: "vertical"
      }, group.map((item, j) => {
        return /* @__PURE__ */ figma.widget.h(Frame, {
          key: j,
          name: "node",
          width: 150,
          height: 150,
          overflow: "visible"
        }, /* @__PURE__ */ figma.widget.h(Frame, {
          width: 150,
          height: 150,
          name: "node-layout",
          overflow: "visible"
        }, item.id === "-" ? /* @__PURE__ */ figma.widget.h(AutoLayout, {
          name: "no-actions"
        }) : item.id === "a" ? /* @__PURE__ */ figma.widget.h(Frame, {
          width: 150,
          height: 150,
          name: "first-node-actions"
        }, /* @__PURE__ */ figma.widget.h(SVG, {
          y: 40,
          x: 105,
          src: buttonSvgSrc,
          onClick: () => addChild(item.id),
          opacity: 0.4,
          hoverStyle: { opacity: 1 }
        })) : /* @__PURE__ */ figma.widget.h(Frame, {
          width: 150,
          height: 150,
          name: "node-actions"
        }, /* @__PURE__ */ figma.widget.h(SVG, {
          y: 40,
          x: 105,
          src: buttonSvgSrc,
          onClick: () => addChild(item.id),
          opacity: 0.4,
          hoverStyle: { opacity: 1 }
        }), /* @__PURE__ */ figma.widget.h(SVG, {
          y: 105,
          x: 40,
          src: buttonSvgSrc,
          onClick: () => addSibling(item.id, item.linkTo, i, j),
          opacity: 0.4,
          hoverStyle: { opacity: 1 }
        }), /* @__PURE__ */ figma.widget.h(SVG, {
          x: 100,
          y: 15,
          src: buttonSvgSrc,
          rotation: 45,
          onClick: () => deleteItem(item.id, item.linkTo, i, j),
          opacity: 0.4,
          hoverStyle: { opacity: 1 }
        })), item.id === "-" ? /* @__PURE__ */ figma.widget.h(figma.widget.Fragment, null) : /* @__PURE__ */ figma.widget.h(Frame, {
          width: 100,
          height: 100,
          cornerRadius: 16,
          fill: {
            type: "gradient-linear",
            gradientHandlePositions: [
              { x: 0, y: 0.1 },
              { x: 1, y: 1 },
              { x: 0, y: 0 }
            ],
            gradientStops: [
              { position: 0, color: { r: rgb[0], g: rgb[1], b: rgb[2], a: 1 } },
              { position: 1, color: { r: rgb[3], g: rgb[4], b: rgb[5], a: 1 } }
            ]
          }
        }, /* @__PURE__ */ figma.widget.h(Input, {
          name: "editable-text",
          width: 100,
          height: 100,
          value: item.text,
          fontWeight: 600,
          onTextEditEnd: (e) => {
            let newData = [...data];
            newData[i][j].text = e.characters;
            setData(newData);
          },
          placeholder: "New note",
          fontSize: 13,
          fill: fontColor,
          inputFrameProps: {
            stroke: strokeColor,
            strokeWidth: 3,
            hoverStyle: {
              stroke: "#4CA7F7"
            },
            cornerRadius: 16,
            padding: 9
          },
          inputBehavior: "wrap"
        }))), drawLine(item.id, j));
      }));
    }));
  };
  widget.register(App);
})();
