import Demo from 'src/components/Demo';

const App = () => {
  return (
    <div className="h-screen w-screen">
      <header className="flex h-12 items-center border-b border-gray-300 bg-white/30 bg-gray-100 px-4 backdrop-blur-md">
        顶部导航
      </header>
      <main className="mx-8 flex h-full">
        <aside className="w-48 border-r p-4">侧边栏</aside>
        <section className="flex-1">
          <Demo />
        </section>
      </main>
    </div>
  );
};

export default App;
