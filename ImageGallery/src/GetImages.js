import './App.css'

function GetImages(props) {
  return (
    <div className="titleImageContainer">
      <div className='titleContainer'>
        <h6>{props.imgObj?.title ?? ""}</h6>
      </div>

      <div className="imageContainer">
        <img src={props.imgObj?.link ?? ""}  alt="" />
      </div>

    </div>
  );
}

export default GetImages