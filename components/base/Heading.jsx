function Heading(props) {
    return (
        <div class="space-y-2 pb-8 pt-6 md:space-y-5">
            <h1 class="text-lg uppercase tracking-wider font-extrabold leading-9  text-white sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                {props.text}
            </h1>
        </div>
    );
}

Heading.props = {
    text: { type: String, default: '' },
};

export default Heading;
