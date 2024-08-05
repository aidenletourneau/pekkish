
export default function Result(props) {


  return (
    <div className='result'>
      <h4>{props.name}</h4>
      <p>{props.address}</p>
      <p>{props.distance}</p>
    </div>
  )
}