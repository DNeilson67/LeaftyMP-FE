import "../style/Circle.css"

function Circle ({ color, position, opacity }) {
    const circleWidth = "190vw";
    const circleHeight = "190vh";
    return (
        <div
        className={`circle-1 rounded-full absolute slide-left hidden md:block`}
        style={{
            width: circleWidth,
            height: circleHeight,
            left: position.left,
            bottom: position.bottom,
            backgroundColor: color,
            opacity: opacity
        }}
      ></div>
    );
  };

export default Circle;

  
