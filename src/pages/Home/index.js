import BarChart from "./components/BarChart"

const Home = () => {


    return (
        <div>
            <BarChart
                title={'三大框架满意度'}
                xData={['Vue', 'React', 'Angular']}
                sData={[2000, 5000, 1000]} />

            <BarChart
                title={'三大框架使用度'}
                xData={['Vue', 'React', 'Angular']}
                sData={[200, 500, 100]}
                style={{ width: '500px', height: '400px' }} />
        </div >

    )
}

export default Home