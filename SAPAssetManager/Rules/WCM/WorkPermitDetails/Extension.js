
export default function Extension(context) {
    return !context.binding.Extension || context.binding.Extension === 0 ? '-' : context.localizeText('x_hours', [context.binding.Extension]);
}
