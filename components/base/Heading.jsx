/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

function Heading(props) {
	return (
		<div class="space-y-2 pb-8 pt-6 md:space-y-5">
			<h1
				class="text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-wider font-extrabold leading-normal"
				innerHTML={props.text}
			></h1>
		</div>
	)
}

Heading.props = {
	text: { type: String, default: '' },
	size: { type: String, default: '' },
}

export default Heading
