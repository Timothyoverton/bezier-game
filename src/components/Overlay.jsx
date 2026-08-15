function Overlay({ variant, title, message, buttonLabel, onButtonClick }) {
  return (
    <div className={`overlay overlay--${variant}`}>
      <div className="overlay-card">
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="btn btn--primary" onClick={onButtonClick}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default Overlay;
