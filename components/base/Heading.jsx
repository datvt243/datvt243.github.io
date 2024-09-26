function Heading(props) {
    return (
        <div className="mb-5 pb-5 border-b block">
            <p className="text-3xl font-bold uppercase tracking-widest">{props.text}</p>
        </div>
    );
}

Heading.props = {
    text: { type: String, default: '' },
};

export default Heading;
