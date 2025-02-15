
import { Header } from "@/components/Header";
import { TruckList } from "@/components/TruckList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 pb-8">
        <TruckList />
      </main>
    </div>
  );
};

export default Index;
