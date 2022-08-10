import React, { useEffect, useState } from "react"
import GetImages from "./GetImages"
import './App.css'
import  Select  from 'react-select'
import CloseIcon from '@mui/icons-material/Close'

const App = () => {

  const [params, setParams] = useState({
    section: "hot",
    sort: "viral",
    page: 1,
    window: "day",
    showViral: true
  })

  const [data, setData] = useState([])

  const handleChange=(key,value)=>{
    setParams({...params,[key]:value})
  }

  const section = [
    { value: 'hot', label: 'Hot' },
    { value: 'top', label: 'Top' },
    { value: 'user', label: 'User' }
  ]

  const sort = [
    { value: 'viral', label: 'Viral' },
    { value: 'top', label: 'Top' },
    { value: 'time', label: 'Time' },
    { value: 'rising', label: 'Rising' }
  ]

  const window = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' }
  ]

  useEffect(() => {
    const { section, sort, page, window, showViral } = params;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + "your api key");

    var requestOptions = {
      headers: myHeaders,
    };

    fetch(`https://api.imgur.com/3/gallery/${section}/${sort}/${window}/${page}?showViral=${showViral}`, requestOptions)
      .then(response => response)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          // console.log({ result })
          setData(result.data)
          // setFiltered(result.data)
        }
      })
      .catch(error => console.log('error', error));
  }, [params])

  const formatData = () => {
    if (data.length == 0) return []
    let newData = []

    data.forEach((singleData) => {
      let imageData = singleData?.images?.find((dataImg) => {
        let link = dataImg?.link?.split(".");
        if (!link) return false
        let checkExtension = link[link.length - 1] === "jpg" || link[link.length - 1] === "png" || link[link.length - 1] === "gif" || link[link.length - 1] === "jpeg"
        
        return checkExtension
      })
      // console.log({ imageData })
      if (imageData) {
        newData.push({ ...singleData, link: imageData.link })
      }
    })

    return newData
  }

  let filteredData = formatData()

  const [modal, setModal] = useState(false);
  const [tempData, setTempData] = useState({
    link: '',
    score: '',
    ups: '',
    downs: '',
    views: ''
  })

  const handleTempData = (modalData) => {
    setModal(true);
    setTempData({...modalData})
  }

  return (
    <div className="app">

      <div className={modal? "modal open" : "modal"}>
        <CloseIcon onClick={() => setModal(false)}/>  
        <div className="zoomedImageContainer">
          <img src={tempData.link} />
          <div className="otherDetailsContainer">
            <h1>{tempData.ups} &#10084;</h1>
            <h1>{tempData.score} &#9734;</h1>
            <h1>{tempData.downs} &#128403;</h1>
            <h1>{tempData.views} &#128065;</h1>
          </div>
        </div>    
      </div>

      <div className="gallery">

        <div className="titleBar">
          <h3 className="titleText text-3xl md:text-4xl lg:text-4xl lg:mb-20 px-8 container mx-auto">Imgur</h3>
        </div>

        <div className="navBarContainer">
          <div className="selection-tab-container px-8 container mx-auto">
            <Select className="selection-tab"
              value={section.find(opt=>opt.value==params.section)}
              options = {section}
              onChange = {(sectionSelected) => {handleChange("section",sectionSelected.value)}}
            />
            <Select className="selection-tab"
              value={sort.find(opt=>opt.value==params.sort)}
              options = {sort}
              onChange = {(sortSelected) => {handleChange("sort",sortSelected.value)}}
            />
            <Select className="selection-tab"
              value={window.find(opt=>opt.value==params.window)}
              options = {window}
              onChange = {(windowSelected) => {handleChange("window",windowSelected.value)}}
            />
            <div className="selection-tab">
              <input type="checkbox" id="viralCheckBox" className="viralCheckBox" checked={params.showViral} onChange = {(e) => handleChange("showViral",e.target.checked)}/>
              <h3 className="showViralText">Show viral</h3>
            </div>
          </div>
          <div className="selection-tab">
            <div className="nextPreviousButtonsContainer md:text-1xl lg:text-1xl lg:mb-1 container mx-auto">
              <div className="nextPreviousButtons" id="previousButton">
                <button disabled={params.page===1? true : false} onClick={() => {handleChange("page", params.page - 1)}}> &#8249; </button>
              </div>
              <div className="nextPreviousButtons">
                <button onClick={() => {handleChange("page", params.page + 1)}}> &#8250; </button>
              </div>
            </div>
          </div>
          
        </div>
          <div className="grid grid-cols-1 gap-5 md: grid-cols-2 xl: grid-cols-5 pb-20 lg:container px-8 container mx-auto">
              {filteredData.map((imgObj, index) => {
                return (             
                  <div className="card"  key={index} onClick={() => handleTempData(imgObj)}>
                        <div className="pics"> 
                          <GetImages key={imgObj?.id} imgObj={imgObj} alt=""/>
                        </div>
                  </div>
                );
              })}
          </div>
      </div>
    </div>
  );
}

export default App;