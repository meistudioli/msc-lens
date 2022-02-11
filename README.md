# msc-lens

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-lens) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/20129/branches/539057/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=20129&bid=539057)

[Google Lens](https://lens.google/) is famous and powerful for image search. Users could use its fancy UI for image selection. I like its effect and wanna to apply it for services I owned. That's also the main reason I wrapped it into &lt;msc-lens />.

Developers could received exactly the image which users just selected and do some analytics and recommend. Then render results through event which &lt;msc-lens /> provided.

![<msc-lens />](https://blog.lalacube.com/mei/img/preview/msc-lens.png)

## Basic Usage

&lt;msc-lens /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-lens />'s html structure and everything will be all set.

- Required Script

```html
<script
  type="module"
  src="https://your-domain/wc-msc-lens.js">        
</script>
```

- Structure

Put `img[slot="msc-lens-vision"]` inside &lt;msc-lens /> as its child. It will use it as source.

```html
<msc-lens>
  <script type="application/json">
    {
      "sensorsize": 28,
      "active": false,
      "delay": 500,
      "format": "blob",
      "webservice": {
        "uri": "https://your-domain/analytic",
        "fieldName": "lens",
        "params": {
          "origin": "extra param you like",
          "id": "extra param you like"
        }
      }
    }
  </script>
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-lens-vision" />
</msc-lens>
```

Otherwise, developers could also choose remoteconfig to fetch config for &lt;msc-lens />.

```html
<msc-lens remoteconfig="https://your-domain/api-path">
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-lens-vision" />
</msc-lens>
```

## JavaScript Instantiation

&lt;msc-lens /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscLens } from 'https://your-domain/wc-msc-lens.js';

// use DOM api
const nodeA = document.createElement('msc-lens');
nodeA.appendChild('img[slot="msc-lens-vision"]');
document.body.appendChild(nodeA);
nodeA.webservice = {
  uri: 'https://your-domain/analytic',
  fieldName: 'lens',
  params: {
    origin: 'extra param you like',
    id: 'extra param you like'
  }
};

// new instance with Class
const nodeB = new MscLens();
nodeB.appendChild('img[slot="msc-lens-vision"]');
document.body.appendChild(nodeB);
nodeB.webservice = {
  uri: 'https://your-domain/analytic',
  fieldName: 'lens',
  params: {
    origin: 'extra param you like',
    id: 'extra param you like'
  }
};

// new instance with Class & default config
const config = {
  sensorsize: 40,
  webservice: {
    uri: 'https://your-domain/analytic',
    fieldName: 'lens',
    params: {
      origin: 'extra param you like',
      id: 'extra param you like'
    }
  }
};
const nodeC = new MscLens(config);
nodeC.appendChild('img[slot="msc-lens-vision"]');
document.body.appendChild(nodeC);
</script>
```

## Style Customization

&lt;msc-lens /> uses CSS variables to style its interface. That means developer could easy change them into the lookup you like.

```html
<style>
msc-lens {
  --msc-lens-overlay-color: rgba(0,0,0,.5);
  --msc-lens-sensor-color: rgba(255,255,255,1);
}
</style>
```

## Attributes

&lt;msc-lens /> supports some attributes to let it become more convenience & useful.

- **sensorsize**

Set sersor size for &lt;msc-lens />. Default is `28` (px).

```html
<msc-lens
  sensorsize="28"
>
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-lens-vision" />
</msc-lens>
```

- **active**

Set active for &lt;msc-lens />. It will switch to select mode once set. Default is `false` (not set).

```html
<msc-lens
  active
>
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-lens-vision" />
</msc-lens>
```

- **delay**

Set delay for &lt;msc-lens />. It will delay fetch web service once user finish select. Default is `500` (ms).

```html
<msc-lens
  delay="500"
>
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-lens-vision" />
</msc-lens>
```

- **format**

Set image format for &lt;msc-lens />. This attribute can only accept "`blob`" or "`dataURL`". Default is "`blob`".

```html
<msc-lens
  format="blob"
>
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-lens-vision" />
</msc-lens>
```


- **webservice**

Set web service information for &lt;msc-lens />. It should be JSON string. Developers could set `uri`、`fieldName` and extra `params` here.

```html
<msc-lens
  webservice='{"uri":"https://your-domain/analytic","fieldName":"lens","params":{"origin":"extra param you like","id":"extra param you like"}}'
>
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-lens-vision" />
</msc-lens>
```


## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| sensorsize | Number | Getter / Setter for senser size. Developers could use this property to setup sensor size. |
| active | Boolean | Getter / Setter for active. It will switch to select / normal mode. |
| delay | Number | Getter / Setter for delay. It will delay fetch web service once user finish select. |
| format | String | Getter / Setter for format. It will set image format. This property can only accept "`blob`" or "`dataURL`". Default is "`blob`". |
| webservice | Object | Getter / Setter for web service information. Developers could set `uri`、`fieldName` and extra `params` here. |

## Method

| Method Signature | Description |
| ----------- | ----------- |
| toggle([force]) | Toggle &lt;msc-lens /> select or normal mode. When argument is present: If the argument is true, &lt;msc-lens /> will switch to select mode, and if it is false, back to normal. |

## Event

| Event Signature | Description |
| ----------- | ----------- |
| msc-lens-switch | Fired when &lt;msc-lens /> mode switched. Developers could get `active` through `event.detail`. |
| msc-lens-capture | Fired when &lt;msc-lens /> captures image selection. Developers could get `image` through `event.detail`. |
| msc-lens-process | Fired when &lt;msc-lens /> fetch web service. |
| msc-lens-result | Fired when &lt;msc-lens /> finished web service fetching. Developers could get `result` through `event.detail`. |

## Reference
- [Google Lens](https://lens.google/)
- [&lt;msc-lens /&gt;](https://blog.lalacube.com/mei/webComponent_msc-lens.html)
