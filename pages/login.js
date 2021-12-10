import { getProviders, signIn } from 'next-auth/react'

const LoginPage = ({ providers }) => {

  const handleLogin = async (id) => {
    try {

      const res = signIn(id, { callbackUrl: '/' })
      console.log('res :>> ', res);
    } catch (err) {
      console.log('err :>> ', err);
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-black">
      <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="Spotify" />
      {Object.values(providers).map(itm => (
        <div key={itm.name}>
          <button
            className="bg-[#18D860] text-white p-3 px-7 rounded-full"
            onClick={() => handleLogin(itm.id)}
          >
            Login with {itm.name}
          </button>
        </div>
      ))}
    </div>
  )
}

export default LoginPage


export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers
    }
  }
}