import beardIcon from "./images/app/beard.png";
import boyIcon from "./images/app/boy.png";
import camoIcon from "./images/app/camouflage.png";
import complexIcon from "./images/app/complex.png";
import haircutIcon from "./images/app/haircut.png";
import manIcon from "./images/app/man.png";
import womanIcon from "./images/app/woman.png";

const dbIconsObj = {
	beardIcon,
	boyIcon,
	camoIcon,
	complexIcon,
	haircutIcon,
	manIcon,
	womanIcon,
};

const dbContactsObj = {
	phoneNumber: "8-999-999-99-99",
	address: "пр. Ленина, 111в",
	linkToAddressIn2gis:
		"https://2gis.ru/magnitogorsk/geo/3659810352402709?m=58.992316%2C53.379106%2F17.55",
};

const dbMastersObj = [
	{
		name: "Никита",
		surname: "Майоров",
		experience: "1 год",
		image: manIcon,
	},
	{
		name: "Андрей",
		surname: "Яковлев",
		experience: "2 года",
		image: manIcon,
	},
	{
		name: "Алиса",
		surname: "Фомичева",
		experience: "6 мес",
		image: womanIcon,
	},
	{
		name: "Дарья",
		surname: "Лаврентьева",
		experience: "5 лет",
		image: womanIcon,
	},
];

const dbServicesObj = [
	{
		name: "Мужская стрижка",
		price: "1500",
		image: haircutIcon,
	},
	{
		name: "Детская стрижка",
		price: "750",
		image: boyIcon,
	},
	{
		name: "Оформление бороды",
		price: "800",
		image: beardIcon,
	},
	{
		name: "Комплекс",
		price: "2000",
		image: complexIcon,
	},
	{
		name: "Камуфляж седины",
		price: "1000",
		image: camoIcon,
	},
];

export { dbIconsObj, dbContactsObj, dbMastersObj, dbServicesObj };
