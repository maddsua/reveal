# This package impements html element reveal animations

Code examples:
```html
<div data-rvl="t25 c50">
	<div data-rvl="tt2 i2 l250">Shows third</div>
	<div data-rvl="tr2 i0 l250">Shows first</div>
	<div data-rvl="tb2 i1 l250">Shows second</div>
</div>
<div data-rvl="t25 tt2 i8 l250">Reveals on itself from top on 25% visible</div>
```

Short-tags are:

### Regular elements:

- animation delay: `d[number]`
- animation length: `l[number]`
- translate: `t[direction][number]`
- reveal order: `i[number]`

### Containers or self-triggering elements

(extends the previous ones)

- trigger threshold: `t[number]`
- default children elements animation delay: `cd[number]`
- default children elements animation length: `cl[number]`
