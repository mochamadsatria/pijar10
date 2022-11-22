import { useState } from "react";
import useSWR from "swr";

import { useForm, SubmitHandler } from "react-hook-form";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Data = {
  id?: number;
  index?: number;
  nama_produk: string;
  keterangan?: string;
  harga: number;
  jumlah?: number;
};

export default function Home() {
  let products: Data[] = useSWR("/api/produk", fetcher).data;
  let productMutate = useSWR("/api/produk", fetcher).mutate;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Data>();

  const [isEdit, setIsEdit] = useState(false);

  const onSubmit: SubmitHandler<Data> = (data) => {
    if (isEdit) {
      productMutate(
        async () => {
          let updatedProduk = await fetch(`/api/produk/${data.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
          }).then((res) => res.json());
          if (updatedProduk && data.index) products[data.index] = updatedProduk;

          return [products];
        },
        { revalidate: true }
      );

      setIsEdit(false);
    } else {
      productMutate(
        async () => {
          delete data.id;
          delete data.index;

          let newProduk = await fetch("/api/produk", {
            method: "POST",
            body: JSON.stringify(data),
          }).then((res) => res.json());

          return [...products, newProduk];
        },
        { revalidate: true }
      );
    }

    reset();
  };

  return (
    <div className="flex justify-center">
      <div className="w-full lg:w-10/12 flex flex-col lg:flex-row gap-10 my-20">
        <div className="flex-1 flex flex-col gap-3 px-5">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">
              {isEdit ? "Edit produk" : "Tambah Produk"}
            </h1>

            {isEdit && (
              <button
                className="font-semibold text-blue-500 bg-blue-50 px-4 hover:bg-blue-200"
                onClick={() => setIsEdit(false)}
              >
                Buat baru
              </button>
            )}
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type={"text"}
              placeholder="Nama produk"
              {...register("nama_produk", { required: true })}
            />
            {errors.nama_produk && (
              <label
                htmlFor="nama_produk"
                className="text-sm text-red-500 font-semibold"
              >
                This field is required
              </label>
            )}
            <textarea
              placeholder="Keterangan"
              {...register("keterangan", { required: false })}
            />
            <div className="flex gap-3">
              <input
                type={"number"}
                placeholder="Harga"
                className="flex-1"
                {...register("harga", { required: true })}
              />
              <input
                type={"number"}
                placeholder="Jumlah stok"
                {...register("jumlah", { required: false })}
              />
            </div>

            <input type={"hidden"} {...register("id", { required: false })} />

            <input
              type={"hidden"}
              {...register("index", { required: false })}
            />

            {errors.harga && (
              <label
                htmlFor="nama_produk"
                className="text-sm text-red-500 font-semibold"
              >
                This field is required
              </label>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white py-4 hover:bg-blue-600 font-semibold"
            >
              {isEdit ? "Simpan perubahan" : "Tambahkan Produk"}
            </button>
          </form>
        </div>
        <div className="flex-1 flex flex-col gap-3 px-5">
          <h1 className="text-2xl font-semibold">Produk</h1>
          <ul className="flex flex-col gap-2">
            {products && products.length == 0 && (
              <h1>Belum ada produk, silahkan tambah produk.</h1>
            )}
            {products &&
              products.length > 0 &&
              products.map((produk, index) => (
                <li className="flex flex-col gap-2" key={produk.id}>
                  <h2 className="font-semibold text-lg">
                    {index + 1}. {produk.nama_produk}
                  </h2>
                  <p className=" text-justify">{produk.keterangan}</p>
                  <h3>
                    Harga:{" "}
                    <span className=" font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                      Rp {produk.harga}
                    </span>
                  </h3>
                  <h3>
                    Stok:{" "}
                    <span className=" font-semibold px-2 py-1 rounded">
                      {produk.jumlah}
                    </span>
                  </h3>
                  <div className="flex w-full">
                    <button
                      type="button"
                      className="flex-1 bg-neutral-100 hover:bg-neutral-200"
                      onClick={() => {
                        setIsEdit(true);
                        setValue("nama_produk", produk.nama_produk);
                        setValue("keterangan", produk.keterangan);
                        setValue("harga", produk.harga);
                        setValue("jumlah", produk.jumlah);
                        setValue("id", produk.id);
                        setValue("index", produk.index);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="flex-1 bg-red-400 text-white font-semibold py-3 hover:bg-red-500"
                      onClick={() => {
                        productMutate(
                          async () => {
                            let deletedProduk = await fetch(
                              `/api/produk/${produk.id}`,
                              {
                                method: "DELETE",
                              }
                            ).then((res) => res.json());

                            if (deletedProduk) products.splice(index, 1);

                            return [products];
                          },
                          { revalidate: true }
                        );
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
