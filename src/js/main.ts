import simpleParallax from 'simple-parallax-js';
import message from './sub'

const data: number[] = [1, 2, 3, 4, 5];

data.map((val) => val * 2);

console.log(data);
console.log(message)

const rocketImage = document.getElementById('rocket');
new simpleParallax(rocketImage, {
	delay: .6,
	transition: 'cubic-bezier(0,0,0,1)'
});

const planet4 = document.getElementById('planet4');
new simpleParallax(planet4, {
	delay: 2,
    orientation: 'down',
	transition: 'cubic-bezier(0,0,0,1)'
});

const planet5 = document.getElementById('planet5');
new simpleParallax(planet5, {
    delay: 1,
    orientation: 'right',
	transition: 'cubic-bezier(0,0,0,1)'
});