export default async function Index() {
  const pop = await fetch('http://localhost:3333/api/seasons/champions?startYear=2005')

  return <>
    <div>Works</div>
    <div className={'font-formula-one-black'}>Works</div>
    <div className={'font-formula-one-bold'}>Works</div>
    <div className={'font-formula-one-regular'}>Works</div>
    <div className={'font-formula-one-wide'}>Works</div>
  </>;
}
