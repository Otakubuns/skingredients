import {useState} from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        //TODO: Implement login
    };

    return (
        <div className="flex justify-center self-center z-10">
            <div className="p-12 bg-white mx-auto rounded-2xl w-100  border-primary border">
                <div className="mb-4">
                    <h3 className="font-semibold text-2xl text-gray-800">Sign In </h3>
                    <p className="text-gray-500">Please sign in to your account.</p>
                </div>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                        <input
                            className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            type="" placeholder="mail@gmail.com"/>
                    </div>
                    <div className="space-y-2">
                        <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                            Password
                        </label>
                        <input
                            className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            type="" placeholder="Enter your password"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember_me" name="remember_me" type="checkbox"
                                   className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"/>
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-800">
                                    Remember me
                                </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="text-neutral">
                                Forgot your password?
                            </a>
                        </div>
                    </div>
                    <div>
                        <button type="submit"
                                className="w-full flex justify-center bg-primary text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;