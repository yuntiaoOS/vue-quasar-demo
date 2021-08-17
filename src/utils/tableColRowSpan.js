//数据组装
export function makeMergeDataFunc(data,StandardKey) {
  let response = []
  let dataCopy = Object.assign([],JSON.parse(JSON.stringify(data))) 
  data = data.map((ele,index)=>{
    // console.log('-------dataCopy----------------',dataCopy[index])
    if (!dataCopy[index].hasOwnProperty('spanCount') ) {
      ele['isMerge'] = false
      ele['spanCount'] = 1
      response.push(ele)
      let spanCount = 1
      dataCopy = dataCopy.map((ele2,index2)=>{
        if (index2 > index && (!ele2.hasOwnProperty('spanCount') )) {
          if (ele[StandardKey] === ele2[StandardKey]) {
            spanCount++
            ele['isMerge'] = true
            ele['spanCount'] = spanCount
            ele2['isMerge'] = false
            ele2['spanCount'] = 0
            response.push(ele2)
          }
        }
        return ele2
      })
    }
    return ele
  })

  
  return response
}

function checkArrayDeep(params) {
  
}
//表头数据组装
export function makeHeaderMergeDataFunc(key_dict,multiHeader,header,x,y) {
  x++
  const multiSubHeader = []
  key_dict.map((ele,index)=>{
    y++
    let obj = { x:x,y:y,hasChild:false,value:ele.value,label:ele.label }
    if (ele.hasOwnProperty('child')){

      obj.hasChild = true
      multiSubHeader.push(obj)
      header.push(obj)
      makeHeaderMergeDataFunc(ele.child,multiHeader,header,x,y)
    }else{
      multiSubHeader.push(obj)
      header.push(obj)
    }
    return ele
  })
  let yNum = 0
  let oldhasChild = false
  let newhasChild = false
  header.map(ele=>{
    newhasChild = ele.hasChild
    if ((!oldhasChild && newhasChild) || (!newhasChild && !oldhasChild)){
      yNum ++
    }
    ele.y = yNum
    oldhasChild = newhasChild
    return ele
  })
  multiHeader.push(multiSubHeader)
}
