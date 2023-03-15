import { mount } from "@vue/test-utils";
import ProductCard from "@/components/shared/ProductCard";

describe("ProductCard", () => {
  const props = {
    id: 0,
    name: "nombre",
    description: "description",
    text: "texto largo",
    slug: "slug",
    category: "categoria",
    city: "ciudad",
    address: "direccion",
    likes: 0,
    image: "image",
  };

  const wrapper = mount(ProductCard, { propsData: props });
  test("is Mounted", () => {
    expect(wrapper.isVueInstance()).toBe(true);
  });
  test("is rendering a restaurant", () => {
    expect(wrapper.props().name).toBe("nombre");
    expect(wrapper.props().description).toBe("description");
  });
});
