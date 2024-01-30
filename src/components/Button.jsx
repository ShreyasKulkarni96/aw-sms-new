const Button = ({ children, disabled, to, style, onClick, type }) => {

    const styles = {
        small: 'mr-1 px-5 py-2 inline-block text-sm font-semibold tracking-wide bg-orange-900 rounded-3xl duration-300 hover:bg-orange-700 shadow-md text-white',
        primary: 'px-5 py-2 inline-block text-sm font-semibold tracking-wide bg-orange-900 rounded-3xl duration-300 hover:bg-orange-700 shadow-md text-white',
        cancle: 'ml-1 px-5 py-2 inline-block text-sm font-semibold tracking-wide bg-black rounded-3xl duration-300 hover:bg-gray-hover shadow-md text-white'
    }

    return (
        <button className={styles[style]} type={type} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;

// <AddRoundedIcon style={{ fontSize: '1.2rem' }} />