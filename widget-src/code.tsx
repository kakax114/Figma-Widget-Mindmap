const { widget } = figma
const { AutoLayout, SVG, Text, Image, Frame, Line, Rectangle, Ellipse, useSyncedState, usePropertyMenu, Input, useEffect, waitForTask } = widget

const App = () => {
  // const [text, setText] = useSyncedState("text", "Hello")
  const [data, setData] = useSyncedState("data", 
        //2d array, parent array is the group, child array is the items
        [
          //2d array, parent array is the group, child array is the items
          [
            {
              id: 'a',
              text: "",
              linkTo: '-',
            },
          ],
        ]
   )
  
  //function to get the position of the input box
  const getXPos = () => {
    return 100
  }

  const getYPos = () => {
    return 50
  }

  const groupIndex = (id) => {
    return data.findIndex((group) => group.some((item) => item.id === id))
  }

  const itemIndex = (id) => {
    //if can find data[groupIndex(id)].findIndex((item) => item.id === id), return that, else return null
    try {
      return data[groupIndex(id)].findIndex((item) => item.id === id)
    } catch {
      return 0
    } 
  }

  const getLinkTo = (id) => {
    return data[groupIndex(id)][itemIndex(id)].linkTo
  }

  const getChildID = (id) => {
    return id + '01'
  }

  //getSiblingID
  const getSiblingID = (id) => {
    let prefix = id.slice(0, -2)
    let lastNumber = parseInt(id.slice(-2))
    if(lastNumber < 9) {
      return prefix + '0'+ (lastNumber + 1)
    } else {
      return prefix + (lastNumber + 1)
    }
  }

  //function to decreament id based on slice(-2)
  const decreamentID = (id) => {
    let prefix = id.slice(0, -2)
    let lastNumber = parseInt(id.slice(-2))
    // console.log('decreament: '+prefix + '0'+ (lastNumber - 1))
    return prefix + '0'+ (lastNumber - 1)
  }

  //get the the biggest id of item that has linkTo = id
  const getBiggestChild = (id) => {
    let items = data[groupIndex(id)+1].filter((item) => item.linkTo === id)
    //use localcompare to sort by id and return the biggest id
    // console.log('big child:' + items.sort((a, b) => a.id.localeCompare(b.id)).pop().id)
    return items.sort((a, b) => a.id.localeCompare(b.id)).pop().id
  }

  const emptyItem = () => {
    return {
      id: '-',
      text: '-',
      linkTo: '-',
    }
  }

  const addChild = (id) => {
    console.log(groupIndex(id), itemIndex(id))

    //if groupindex (id)+1 doesn't exist, create new group
    if(!data[groupIndex(id)+1]) {
      //create new group and fill with empty item
      let newGroup = []
      //add empty item to new group data[0].length times
      for(let i = 0; i < data[0].length; i++) {
        newGroup.push(emptyItem())
      }

      //make new group [groupindex(id)+1][0] = id: getChildID(id), text: 'new text', linkTo: id
      newGroup[itemIndex(id)] = {
        id: getChildID(id),
        text: '',
        linkTo: id,
      }

      setData([...data, newGroup])
    } else if (data[groupIndex(id)+1][itemIndex(id)].id === '-') {
      data[groupIndex(id)+1][itemIndex(id)] = {
        id: getChildID(id),
        text: '',
        linkTo: id,
      }
      setData([...data])

    } else {
      let newID = getBiggestChild(id)
      addSibling(newID, getLinkTo(newID), groupIndex(newID), itemIndex(newID))
    }
  }

  const clearEmptyRowCol = (newData) => {
    //run 5 times to make sure all empty rows and cols are removed
    for(let k = 0; k < 5; k++) {
      //for loop each group
      for(let i = 0; i < newData.length; i++) {
        //use every to check if all in newData[i] is empty
        if(newData[i].every((item) => item.id === '-')) {
          //if all empty, remove that group
          newData.splice(i, 1)
        }
      }
      //for loop each item in each group
      //if [i] in all the groups are empty, splice that item from all the groups
      for(let i = 0; i < newData[0].length; i++) {
        try {
          if(newData.every((group) => group[i].id === '-')) {
            for(let j = 0; j < newData.length; j++) {
              newData[j].splice(i, 1)
            }
          }
        } catch {
          console.log('error')
        }
      }
    }

    setData(newData)
  }

  const simpleDelete = (id) => {
    console.log('simple delete')
    let items = []
    //copy data
    let newData = [...data]
    //deep copy data
    //for loop each group
    for(let i = 0; i < newData.length; i++) {
      //for loop each item in group
      for(let j = 0; j < newData[i].length; j++) {
        //if item id contains id, add to item array
        if(newData[i][j].id.includes(id)) {
          items.push(newData[i][j])
          newData[i][j] = emptyItem()
        }
      }
    }

    console.log(items)
    clearEmptyRowCol(newData)
  }

  const drawLine = (id, itemIndex) => {
    //if id is not empty and linkTo is not empty
    
    
    try{
      if(id !== '-' && data[groupIndex(id)+1][itemIndex].linkTo !== '-') {
      // get gorupindex of id using the groupIndex function
      let idPosition = itemIndex
      let cardHeight = 150
      // const line length is 5
      const defaultLineLength = 50
      //get all children that has linkto = id
      
      let children = data[groupIndex(id)+1].filter((item) => item.linkTo === id)

     
      //for each child, get the index of the child in the group
      let childIndex = children.map((child) => data[groupIndex(id)+1].indexOf(child))
      //log all children
      console.log('origin: '+ parseInt(idPosition*cardHeight+cardHeight/2) )

      
      
      // create empty array to store all diagonal lines
      let diagonalLines = []
      // for each child work out the diagonal line
      for(let i = 0; i < children.length; i++) {
        // do Math.sqrt(Math.pow(lineLength, 2) + Math.pow(childIndex[i]*30, 2)), add to array
        diagonalLines.push(Math.sqrt(Math.pow(defaultLineLength, 2) + Math.pow((childIndex[i]-idPosition)*cardHeight, 2)))
      }

      // array to store all angles of the diagonal lines
      let angles = []
      // for each child work out the angle
      for(let i = 0; i < children.length; i++) {
        // do Math.atan(childIndex[i]*30/lineLength), convert radians to degrees then  add to array
        angles.push(-(Math.atan((childIndex[i]-idPosition)*cardHeight/defaultLineLength) * 180 / Math.PI))
      }

      //lines object
      let lines = []

      // log each child: child id, index: child index, line: diagonal line, angle: angle 
      for(let i = 0; i < children.length; i++) {
        console.log('child: '+children[i].id, 'index: '+childIndex[i], 'line: '+diagonalLines[i], 'angle: '+angles[i])
        lines.push(
            <Line
              x={100}
              y={75}
              length={diagonalLines[i]}
              rotation={angles[i]}
              stroke={"#B18CED"}
              strokeWidth={4}
              opacity={0.5}
              strokeCap={"round"}
            />
        )
      }
      return lines
    }
    } catch {
      console.log('error')
    }
    
  
    
  }


  const deleteItem = (id, linkTo, groupIndex, itemIndex) => {
    let newData = [...data]
    let moveBy = 1
    //if id end with 01, delete all children
    if(id.slice(-2) === '01') {
      //count the number of empty items to the next item
      for(let i = itemIndex + 1; i < newData[groupIndex].length; i++) {
        if(newData[groupIndex][i].id === '-') {
          moveBy++
        } else {
          break
        }
      }
    }
    let lastItem = true
    //if item is the last item in the group
    if (itemIndex === data[groupIndex].length - 1) {
      lastItem = true
    } else {
      for(let i = itemIndex+1; i < data[groupIndex].length; i++) {
        if(data[groupIndex][i].id !== '-') {
          // console.log(data[groupIndex][i].id)
          lastItem = false
        }
      }
    }

    if(lastItem) {
      simpleDelete(id)
    } else {
      console.log('advanced delete')
      console.log(id, groupIndex, itemIndex)
      //replace id and id's children with empty item
      for(let i = 0; i < newData.length; i++) {
        for(let j = 0; j < newData[i].length; j++) {
          if(newData[i][j].id.includes(id)) {
            newData[i][j] = emptyItem()
          }
        }
      }

      let changedItems = []
      //get all items from itemIndex+1 to the end of the group
      let items = newData[groupIndex].slice(itemIndex+1)
      //remove items with id = '-' and items linkto that is not linkTo
      items = items.filter((item) => item.id !== '-' && item.linkTo === linkTo)
      console.log('items to decrement')
      console.log(items)
      //if items lenghth is 1, apparently if length is 1, it doesn't work properly like other cases :(, so I have to do this
      if(items.length === 1) {
        //make a deep copy of items[0]
        let item = JSON.parse(JSON.stringify(items[0]))
        for (let i = groupIndex; i < newData.length; i++) {
          console.log('scanned through group: ' + newData[i])
          for (let j = 0; j < newData[i].length; j++) {
            console.log('taking '+ item.id +' scanned through item: ' + newData[i][j].id)
            if(newData[i][j].id.includes(item.id)) {
              let tempID = ''
              console.log('old id: '+newData[i][j].id)
              tempID = newData[i][j].id.replace(item.id, decreamentID(item.id))
              console.log('new id: '+tempID)
              newData[i][j].id = tempID
              // newData[i][j].id = newData[i][j].id.replace(item.id, decreamentID(item.id))
              changedItems.push({item: newData[i][j], col: i, rol: j})
            }
            if (newData[i][j].linkTo.includes(item.id)) {
              newData[i][j].linkTo = newData[i][j].linkTo.replace(item.id, decreamentID(item.id))
            }
          }

        }
      } else {
        items.forEach((item) => {
          for (let i = groupIndex; i < newData.length; i++) {
            console.log('scanned through group: ' + newData[i])
            for (let j = 0; j < newData[i].length; j++) {
              console.log('taking '+ item.id +' scanned through item: ' + newData[i][j].id)
              if(newData[i][j].id.includes(item.id)) {
                let tempID = ''
                console.log('old id: '+newData[i][j].id)
                tempID = newData[i][j].id.replace(item.id, decreamentID(item.id))
                console.log('new id: '+tempID)
                newData[i][j].id = tempID
                // newData[i][j].id = newData[i][j].id.replace(item.id, decreamentID(item.id))
                changedItems.push({item: newData[i][j], col: i, rol: j})
              }
              if (newData[i][j].linkTo.includes(item.id)) {
                newData[i][j].linkTo = newData[i][j].linkTo.replace(item.id, decreamentID(item.id))
              }
            }
  
          }
        })
      }

      
      //sort changedItems by rol then by col
      changedItems.sort((a, b) => {
        if(a.rol < b.rol) {
          return -1
        } else if(a.rol > b.rol) {
          return 1
        } else {
          if(a.col < b.col) {
            return -1
          } else if(a.col > b.col) {
            return 1
          } else {
            return 0
          }
        }
      })
      
      //for loop each changed item
      for(let i = 0; i < changedItems.length; i++) {
        //find the matching item in newData
        for(let j = 0; j < newData.length; j++) {
          for(let k = 0; k < newData[j].length; k++) {
            if(newData[j][k].id === changedItems[i].item.id) {
              //move the item to the to k-1
              console.log('move item: '+newData[j][k].id+' from ' + k + ' to '+(k-moveBy))
              newData[j][k-moveBy] = changedItems[i].item
              newData[j][k] = emptyItem()
            }
          }
        }
      }


      console.log('changed items')
      console.log(changedItems)




      clearEmptyRowCol(newData)
      // setData(newData)
    }
  }


  //add new row at bottom of every group
  const addRow = () => {
    let newData = [...data]
    newData.forEach((group) => {
      group.push(emptyItem())
    })
    return newData
  }

  const biggestIndex = (id) => {
    let temp = []
    //show which the number of items with id containing id from each group
    for (let i = 0; i < data.length; i++) {
      let tempID = ''
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j].id.includes(id)) {
          tempID = data[i][j].id
        }
      }
      console.log('id index: ' + tempID)
      temp.push(itemIndex(tempID))

    }

    console.log('compare depth:' + temp)

    return Math.max(...temp)
  }


  const addSibling = (id, linkTo, groupIndex, itemIndex) => {
    console.log('add sibling from: ' + id)

    //step 1, add new row to every group
    let newData = addRow()

    //step 2, get the index deepest child of item
    let addToIndex = biggestIndex(id)+1

    //get items from the same group, from addtoindex to the end exluding one with id = '-'
    let items = newData[groupIndex].slice(addToIndex, -1)
    //remove items with id = '-'
    items = items.filter((item) => item.id !== '-')

    //loop each items
    items.forEach((item) => {
      for(let i = newData.length-1; i >= 0; i--) {
        for(let j = newData[i].length-2; j >= addToIndex; j--) {
            if(newData[i][j].id.includes(item.id)) {
              newData[i][j].id = newData[i][j].id.replace(item.id, getSiblingID(item.id))
            }
            if (newData[i][j].linkTo.includes(item.id)) {
              newData[i][j].linkTo = newData[i][j].linkTo.replace(item.id, getSiblingID(item.id))
            }
        }
      }
    })

    //stpe 3 , every group, every item from bottom-1 to addToIndex, move item down 1, and empty original item empty
    for(let i = newData.length-1; i >= 0; i--) {
      for(let j = newData[i].length-2; j >= addToIndex; j--) {
        newData[i][j+1] = newData[i][j]
        newData[i][j] = emptyItem()
      }
    }





    //step 4, add new item to the addToIndex
    newData[groupIndex][addToIndex] = {
      id: getSiblingID(id),
      //text: current hours, minutes, seconds,
      text: '',
      linkTo: linkTo,
    }

    setData(newData)

    console.log(items)
    console.log('insert at: '+ addToIndex)
    console.log(newData)

  }




  //function get font size based on what text charater length is
  const getFontSize = () => {
    if (text.length > 10 && text.length < 20) {
      return 20
    } else if (text.length > 20) {
      return 10
    } else {
      return 11
    }
  }

 

  const buttonSvgSrc = `
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15.5" fill="#F3F3F4"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17 8H15V15H8V17H15V24H17V17H24V15H17V8Z" fill="black" fill-opacity="0.4"/>
    </svg>
  `;

  const background = 'background.png'


    

  return (
    <AutoLayout
      direction="horizontal"
      fill={{
        type: 'image',
        src: background,
        scaleMode: 'tile',
        scalingFactor: 0.1,
      }}
    >
    {data.map((group, i) => {
        return (
          <AutoLayout 
            key={i}
            name='column'
            direction="vertical"
          >
            {group.map((item, j) => {
              return (
                <Frame 
                  key={j}
                  name='node'
                  width={150}
                  height={150}
                  overflow="visible"
                >
                  
                  {/* loop through the drawLine(item.id, j) funtion and draw all lines */}
                  
                <Frame
                  width={150}
                  height={150}
                  // direction="vertical"
                  name="node-layout"
                  overflow="visible"
                >
                  



                  {/* <p>{item.text}</p> */}
                  
                  {/* if item.id is '-', then render empty buttons, else if item.id is 'a', render without add sibling buttong, else render all 3 buttons */}
                  {item.id === '-' ? (
                    <AutoLayout
                      name="no-actions"
                    >
                      {/* <button>-----</button>
                      <button>-----</button> */}
                      {/* a div with 171.766 x 130 */}
                      {/* <Frame style={{width: "171.766px", height: "146px"}}></div> */}
                    </AutoLayout>
                  ) : item.id === 'a' ? (
                      <Frame
                        width={150}
                        height={150}
                        name="first-node-actions"
                      >
                        <SVG
                          y={40}
                          x={105}
                          src={buttonSvgSrc}
                          onClick={() => addChild(item.id)}
                          opacity={0.4}
                          hoverStyle={{opacity: 1}}
                        />
                        {/* <Text fontSize={8} onClick={() => addChild(item.id)}>add child</Text> */}
                        {/* <Text fontSize={8} onClick={() => drawLine(item.id, j)}>|</Text> */}
                         
                        {/* <Text fontSize={8}>{drawLine(item.id, j)}</Text> */}
                      </Frame>
                  ) : (
                      <Frame
                        width={150}
                        height={150}
                        name="node-actions"
                      >
                        {/* <Text fontSize={8} onClick={() => addChild(item.id)}>add child</Text> */}
                        <SVG
                          y={40}
                          x={105}
                          src={buttonSvgSrc}
                          onClick={() => addChild(item.id)}
                          opacity={0.4}
                          hoverStyle={{opacity: 1}}
                        />
                        
                        <SVG
                          y={105}
                          x={40}
                          src={buttonSvgSrc}
                          onClick={() => addSibling(item.id, item.linkTo, i, j)}
                          opacity={0.4}
                          hoverStyle={{opacity: 1}}
                        />

                        <SVG
                          x={100}
                          y={15}
                          src={buttonSvgSrc}
                          rotation={45}
                          onClick={() => deleteItem(item.id, item.linkTo, i, j)}
                          opacity={0.4}
                          hoverStyle={{opacity: 1}}
                        />

                        
                        {/* <Text fontSize={8} onClick={() => addSibling(item.id, item.linkTo, i, j)}>add sibling</Text> */}
                        {/* <Text fontSize={8} onClick={() => deleteItem(item.id, item.linkTo, i, j)}>x</Text> */}
                        {/* add a button that calls childposition function */}
                        {/* <Text fontSize={8} onClick={() => drawLine(item.id, j)}>|</Text> */}
                        {/* <Text fontSize={8}>{drawLine(item.id, j)}</Text> */}
                      </Frame>

                  )}


                  {/* if id is '-' render as <p>, else render as editable <input> */}
                  {item.id === '-' ? (
                    <>
                    
                    {/* <Text>{item.text}</Text> */}
                    
                    </>
                  ) : (
                    // <AutoLayout
                    //   name="outline style"
                    //   stroke={"#ffffff"}
                    //   strokeWidth={3}
                    //   cornerRadius={24}
                    //   padding={7}
                    //   hoverStyle={{stroke:"#4CA7F7"}}
                    // >
                    <Frame
                      width={100}
                      height={100}
                      cornerRadius={16}
                      fill={{
                        type: "gradient-linear",
                        gradientHandlePositions: [
                          { x: 0, y: 0.1 },
                          { x: 1, y: 1 },
                          { x: 0, y: 0 }
                        ],
                        gradientStops: [
                          { position: 0, color: { r: 0.48, g: 0.92, b: 0.67, a: 1 } },
                          { position: 1, color: { r: 0.47, g: 0.85, b: 0.39, a: 1 } }
                        ]
                      }}
                      
                    >
                      {/* <Text>{item.id}</Text> */}
                      {/* text editor */}
                      
                      <Input
                        name="editable-text"
                        width={100}
                        height={100}
                        value={item.text}
                        onTextEditEnd={(e) => {
                          let newData = [...data]
                          newData[i][j].text = e.characters
                          setData(newData)
                        }}
                        placeholder="New note"
                        fontSize={13}
                        fill="#ffffff"
                        inputFrameProps={{
                          // fill: "#ffffff",
                          //fill with gradient
                          stroke: "#ffffff",
                          strokeWidth: 3,
                          hoverStyle: {
                            stroke: "#4CA7F7",
                          },

                          cornerRadius: 16,
                          padding: 8,
                        }}



                        inputBehavior="wrap"
                      />
                      
                      {/* <p>{item.linkTo}</p> */}
                    </Frame>
                    // </AutoLayout>
                  )}



                </Frame> 
                {/* node layout end */}
                {/* call drawline function here */}
                {drawLine(item.id, j)}
                </Frame>
              )
            })}
          </AutoLayout>
        )
      })}

    </AutoLayout>
  )
}



widget.register(App)
