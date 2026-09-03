import { useForm } from "react-hook-form";
import { createPantryItem } from "../../services/api-service";

function PantryForm({ onItemCreated }) {
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm({ mode: "all" });

	const handleFormSubmit = async (data) => {
		try {
			const pantryItem = await createPantryItem({
				...data,
				quantity: Number(data.quantity),
			});

			reset();
			onItemCreated?.(pantryItem);
		} catch (error) {
			console.error("Error submitting pantry form:", error);

			const serverErrors = error.response?.data?.errors;

			if (serverErrors) {
				Object.entries(serverErrors).forEach(([field, message]) => {
					setError(field, { message });
				});
			} else {
				setError("root", {
					message: error.response?.data?.message || "No se pudo añadir el ingrediente",
				});
			}
		}
	};

	return (
		<div className="pantry-form__container">
			<form onSubmit={handleSubmit(handleFormSubmit)} className="pantry-form">
				<div className="pantry-form__header">
					<h4 className="pantry-form__title">Add ingredient</h4>
				</div>

				<div className="pantry-form__body">
					<div className="pantry-form__field">
						<label htmlFor="ingredient">Ingredient</label>
						<input
							id="ingredient"
							type="text"
							{...register("ingredient", {
								required: "El ingrediente es obligatorio",
							})}
							placeholder="Tomato"
						/>
						{errors.ingredient && <p>{errors.ingredient.message}</p>}
					</div>

					<div className="pantry-form__field">
						<label htmlFor="quantity">Quantity</label>
						<input
							id="quantity"
							type="number"
							min="0.01"
							step="any"
							{...register("quantity", {
								required: "La cantidad es obligatoria",
								min: { value: 0.01, message: "La cantidad debe ser mayor que cero" },
							})}
							placeholder="1"
						/>
						{errors.quantity && <p>{errors.quantity.message}</p>}
					</div>

					<div className="pantry-form__field">
						<label htmlFor="unit">Unit</label>
						<input
							id="unit"
							type="text"
							{...register("unit", { required: "La unidad es obligatoria" })}
							placeholder="kg"
						/>
						{errors.unit && <p>{errors.unit.message}</p>}
					</div>
				</div>

				<div className="pantry-form__footer">
					<button
						className="pantry-form__submit-button"
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Adding..." : "Add ingredient"}
					</button>
				</div>
			</form>

			{errors.root && <p className="pantry-form__global-error">{errors.root.message}</p>}
		</div>
	);
}

export default PantryForm;
