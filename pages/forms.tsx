import { FieldErrors, useForm } from "react-hook-form";

// Less code (c)
// Better validation(c)
// Better Errors (set, clear, display)
// Have control over inputs
// Don't deal with events (c)
// Easier Inputs (c)

interface LoginForm {
    username: string;
    password: string;
    email: string;
    errors?: string;
}

export default function Forms() {
    const {
        register,
        watch, // ()안에 인자를 넣어 요소 지정 출력 가능
        handleSubmit, //submit버튼 누를 시 실행되는 함수 인자 지정(valid, invalid)
        formState: { errors },
        setValue,
        setError,
        reset,
        resetField, // 요소 지정 초기화
    } = useForm<LoginForm>({
        mode: "onChange",
    });

    // register의 역할 : input 들을 전부 status에 등록
    // console.log(watch()); //전체 form정보 출력
    // formState를 사용하여 태그 밖에서도 error 메세지 사용 가능

    const onValid = (data: LoginForm) => {
        console.log("I'm valid");
        // setError("username", { message: "Taken username" });
        reset();
    };
    const onInvalid = (errors: FieldErrors) => {
        console.log(errors);
    };
    return (
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
            <input
                {...register("username", {
                    required: "Username is required",
                    minLength: {
                        message: "The username should be longer than 5 chars.",
                        value: 5,
                    },
                })}
                type="text"
                placeholder="Username"
            />
            {errors.username?.message}
            <input
                {...register("email", {
                    required: "Email is required",
                    validate: {
                        notGmail: (value) => !value.includes("@gmail.com") || "Gmail isn't allowed",
                    },
                })}
                type="email"
                placeholder="Email"
                className={`${Boolean(errors.email) ? "border-red-500" : ""}`}
            />
            {errors.email?.message}
            <input
                {...register("password", {
                    required: "Password is required",
                })}
                type="password"
                placeholder="Password"
            />
            {errors.password?.message}
            <input type="submit" value="Create Account" />
            {/* {errors.errors?.message} */}
        </form>
    );
}
