import {SQUARE_SIZE} from '../const';

const COLOR_ENERGY = '#FFE8BC'
const COLOR_EMPTY = '#555555'
const COLOR_ROAD = '#666666'
const COLOR_CREEP = '#444444'
const COLOR_TERMINAL = '#AAAAAA'
const TILE_SIZE = SQUARE_SIZE

const STRUCTURE_EXTENSION = 'extension'
const STRUCTURE_SPAWN = 'spawn'
const STRUCTURE_POWER_SPAWN = 'powerSpawn'
const STRUCTURE_LAB = 'lab'
const STRUCTURE_TOWER = 'tower'
const STRUCTURE_LINK = 'link'
const STRUCTURE_TERMINAL = 'terminal'
const STRUCTURE_ROAD = 'road'
const STRUCTURE_RAMPART = 'rampart'
const STRUCTURE_WALL = 'wall'
const STRUCTURE_STORAGE = 'storage'
const STRUCTURE_OBSERVER = 'observer'
const STRUCTURE_NUKER = 'nuker'

export default class RoomVisual {
  constructor(canvas){
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }
  renderVisuals(rawvisuals){
    let visuals = rawvisuals.split("\n").filter(v=>v)

    visuals.forEach(v=>{
      // console.log('v',v)
      v = JSON.parse(v)
      this.renderVisual(v)
    })
  }

  renderVisual(v){
    // console.log('renderVisual',v)
    let ctx = this.ctx
    let ht = TILE_SIZE/2
    ctx.save()
    ctx.translate(ht,ht)
    let {t,x,y,s,text,points} = v
    let map = {
      t: ()=>this.text(text,x,y,s),
      p: ()=>this.poly(points,s),
      c: ()=>this.circle(x,y,s)
    }
    // {"t":"p","points":[[14,16],[13,16],[12,16],[11,17],[10,18],[9,19],[8,20],[8,21]],"s":{"fill":"transparent","stroke":"red","lineStyle":"dashed","strokeWidth":0.15,"opacity":0.4}}↵"
    map[t]()
    ctx.translate(-ht,-ht)
    ctx.restore()
  }

  applyStyle(style){
    let ctx = this.ctx
    ctx.fillStyle = style.color || style.fill || '#ffffff'
    ctx.globalAlpha = style.opacity || 0.5
    ctx.lineWidth = (style.strokeWidth || style.width || 0.1) * TILE_SIZE
    ctx.strokeStyle = style.stroke || '#ffffff'
    ctx.setLineDash([1,0])
    ctx.lineCap = 'butt'
    if(style.lineStyle == 'dashed'){
      ctx.setLineDash([TILE_SIZE/2,TILE_SIZE/2])
    }
    let fs = style.fontSize || 0.5
    ctx.font = `${fs * TILE_SIZE * 2}pt sans-serif`
    // console.log(ctx.strokeStyle)
  }

  text(text,x,y,style){
    let ctx = this.ctx
    ctx.save()
    this.applyStyle(style)
    ctx.fillText(text,x * TILE_SIZE,y * TILE_SIZE)
    ctx.restore()
  }
  circle(x,y,style){
    let ctx = this.ctx
    ctx.save()
    this.applyStyle(style)
    let r = style.radius || 0.15
    ctx.beginPath()
    ctx.arc(x * TILE_SIZE,y * TILE_SIZE,r * TILE_SIZE, 0, 2 * Math.PI)
    ctx.fill()
    if(style.stroke)
      ctx.stroke()
    ctx.restore() 
  }
  poly(points,style){
    let ctx = this.ctx
    ctx.save()
    this.applyStyle(style)
    ctx.beginPath()
    ctx.moveTo(points[0][0] * TILE_SIZE,points[0][1] * TILE_SIZE)
    for(let i=1;i<points.length;i++)
      ctx.lineTo(points[i][0] * TILE_SIZE,points[i][1] * TILE_SIZE)
    ctx.fill()
    if(style.stroke)
      ctx.stroke()
    ctx.restore() 
  }
  rect(x,y,w,h,style){
    let ctx = this.ctx
    ctx.save()
    this.applyStyle(style)
    let r = style.radius || 0.15
    ctx.beginPath()
    ctx.rect(x * TILE_SIZE,y * TILE_SIZE,w * TILE_SIZE,h * TILE_SIZE)
    ctx.fill()
    if(style.stroke)
      ctx.stroke()
    ctx.restore() 
  }
}

const colors = {
  gray: '#555555',
  light: '#AAAAAA',
  road: '#666', // >:D
  energy: '#FFE87B',
  power: '#F53547',
  dark: '#181818',
  outline: '#8FBB93',
  speechText: '#000000',
  speechBackground: '#2ccf3b'
}

const speechSize = 0.5
const speechFont = 'Times New Roman'

RoomVisual.prototype.structure = function(x,y,type,opts={}){
  opts = Object.assign({
    opacity: 1
  },opts)
  switch(type){
    case STRUCTURE_EXTENSION:
      this.circle(x,y,{
        radius: 0.5,
        fill: colors.dark,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.circle(x,y,{
        radius: 0.35,
        fill: colors.gray,
        opacity: opts.opacity
      })
      break
    case STRUCTURE_SPAWN:
      this.circle(x,y,{
        radius: 0.65,
        fill: colors.dark,
        stroke: '#CCCCCC',
        strokeWidth: 0.10,
        opacity: opts.opacity
      })
      this.circle(x,y,{
        radius: 0.40,
        fill: colors.energy,
        opacity: opts.opacity
      })

      break;
    case STRUCTURE_POWER_SPAWN:
      this.circle(x,y,{
        radius: 0.65,
        fill: colors.dark,
        stroke: colors.power,
        strokeWidth: 0.10,
        opacity: opts.opacity
      })
      this.circle(x,y,{
        radius: 0.40,
        fill: colors.energy,
        opacity: opts.opacity
      })
      break;
    case STRUCTURE_LINK:
    {
      let osize = 0.3
      let isize = 0.2
      let outer = [
        [0.0,-0.5],
        [0.4,0.0],
        [0.0,0.5],
        [-0.4,0.0]
      ]
      let inner = [
        [0.0,-0.3],
        [0.25,0.0],
        [0.0,0.3],
        [-0.25,0.0]
      ]
      outer = relPoly(x,y,outer)
      inner = relPoly(x,y,inner)
      outer.push(outer[0])
      inner.push(inner[0])
      this.poly(outer,{
        fill: colors.dark,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.poly(inner,{
        fill: colors.gray,
        stroke: false,
        opacity: opts.opacity
      })
      break;
    }
    case STRUCTURE_TERMINAL:
    {
      let outer = [
        [0.0,-0.8],
        [0.55,-0.55],
        [0.8,0.0],
        [0.55,0.55],
        [0.0,0.8],
        [-0.55,0.55],
        [-0.8,0.0],
        [-0.55,-0.55],
      ]
      let inner = [
        [0.0,-0.65],
        [0.45,-0.45],
        [0.65,0.0],
        [0.45,0.45],
        [0.0,0.65],
        [-0.45,0.45],
        [-0.65,0.0],
        [-0.45,-0.45],
      ]
      outer = relPoly(x,y,outer)
      inner = relPoly(x,y,inner)
      outer.push(outer[0])
      inner.push(inner[0])
      this.poly(outer,{
        fill: colors.dark,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.poly(inner,{
        fill: colors.light,
        stroke: false,
        opacity: opts.opacity
      })
      this.rect(x-0.45,y-0.45,0.9,0.9,{
        fill: colors.gray,
        stroke: colors.dark,
        strokeWidth: 0.1,
        opacity: opts.opacity
      })
      break;
    }
    case STRUCTURE_LAB:
      this.circle(x,y-0.025,{
        radius: 0.55,
        fill: colors.dark,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.circle(x,y-0.025,{
        radius: 0.40,
        fill: colors.gray,
        opacity: opts.opacity
      })
      this.rect(x-0.45,y+0.3,0.9,0.25,{
        fill: colors.dark,
        stroke: false,
        opacity: opts.opacity
      })
      {
        let box = [
          [-0.45,0.3],
          [-0.45,0.55],
          [0.45,0.55],
          [0.45,0.3],
        ]
        box = relPoly(x,y,box)
        this.poly(box,{
          stroke: colors.outline,
          strokeWidth: 0.05,
          fill: colors.gray,
          opacity: opts.opacity
        })
      }
      break
    case STRUCTURE_TOWER:
      this.circle(x,y,{
        radius: 0.6,
        fill: colors.dark,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.rect(x-0.4,y-0.3,0.8,0.6,{
        fill: colors.gray,
        opacity: opts.opacity
      })
      this.rect(x-0.2,y-0.9,0.4,0.5,{
        fill: colors.light,
        stroke: colors.dark,
        strokeWidth: 0.07,
        opacity: opts.opacity
      })
      break;
    case STRUCTURE_ROAD:
      this.circle(x,y,{
        radius: 0.175,
        fill: colors.road,
        stroke: false,
        opacity: opts.opacity
      })
      if(!this.roads) this.roads = []
      this.roads.push([x,y])
      break;
    case STRUCTURE_RAMPART:
      this.circle(x,y,{
        radius: 0.65,
        fill: '#434C43',
        stroke: '#5D735F',
        strokeWidth: 0.10,
        opacity: opts.opacity
      })
      break;
    case STRUCTURE_WALL:
      this.circle(x,y,{
        radius: 0.40,
        fill: colors.dark,
        stroke: colors.light,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      break;
    case STRUCTURE_STORAGE:
      this.circle(x, y, {
        fill: colors.energy,
        radius: 0.35,
        stroke: colors.dark,
        strokeWidth: 0.20,
        opacity: opts.opacity
      })
      break;
    case STRUCTURE_OBSERVER:
      this.circle(x, y, {
        fill: colors.dark,
        radius: 0.45,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.circle(x + 0.225, y, {
        fill: colors.outline,
        radius: 0.20,
        opacity: opts.opacity
      })
      break;
    case STRUCTURE_NUKER:
      let outline = [
        [0,-1],
        [-0.47,0.2],
        [-0.5,0.5],
        [0.5,0.5],
        [0.47,0.2],
        [0,-1],
      ];
      outline = relPoly(x,y,outline)
      this.poly(outline,{
        stroke: colors.outline,
        strokeWidth: 0.05,
        fill: colors.dark,
        opacity: opts.opacity
      })
      let inline = [
        [0,-.80],
        [-0.40,0.2],
        [0.40,0.2],
        [0,-.80],
      ]
      inline = relPoly(x,y,inline)
      this.poly(inline,{
        stroke: colors.outline,
        strokeWidth: 0.01,
        fill: colors.gray,
        opacity: opts.opacity
      })
      break;
    case STRUCTURE_CONTAINER:
      this.rect(x - 0.225, y - 0.3, 0.45, 0.6,{
          fill: "yellow",
          opacity: options.opacity,
          stroke: colors.dark,
          strokeWidth: 0.10,
        });
      break;
    default:
      this.circle(x, y, {
        fill: colors.light,
        radius: 0.35,
        stroke: colors.dark,
        strokeWidth: 0.20,
        opacity: opts.opacity
      })
      break;
  }
}

const dirs = [
  [],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
]

RoomVisual.prototype.connectRoads = function(opts={}){
  let color = opts.color || colors.road || 'white'
  if(!this.roads) return
  // this.text(this.roads.map(r=>r.join(',')).join(' '),25,23)
  this.roads.forEach(r=>{
    // this.text(`${r[0]},${r[1]}`,r[0],r[1],{ size: 0.2 })
    for(let i=1;i<=4;i++){
      let d = dirs[i]
      let c = [r[0]+d[0],r[1]+d[1]]
      let rd = _.some(this.roads,r=>r[0] == c[0] && r[1] == c[1])
      // this.text(`${c[0]},${c[1]}`,c[0],c[1],{ size: 0.2, color: rd?'green':'red' })
      if(rd){
        this.line(r[0],r[1],c[0],c[1],{
          color: color,
          width: 0.35,
          opacity: opts.opacity || 1
        })
      }
    }
  })
}


RoomVisual.prototype.speech = function(text, x, y, opts={}) {
  var background = !!opts.background ? opts.background : colors.speechBackground
  var textcolor = !!opts.textcolor ? opts.textcolor : colors.speechText
  var textstyle = !!opts.textstyle ? opts.textstyle : false
  var textsize = !!opts.textsize ? opts.textsize : speechSize
  var textfont = !!opts.textfont ? opts.textfont : speechFont
  var opacity = !!opts.opacity ? opts.opacity : 1

  var fontstring = ''
  if(textstyle) {
    fontstring = textstyle + ' '
  }
  fontstring += textsize + ' ' + textfont

  let pointer = [
    [-0.2, -0.8],
    [ 0.2, -0.8],
    [ 0,   -0.3]
  ]
  pointer = relPoly(x,y,pointer)
  pointer.push(pointer[0])

  this.poly(pointer,{
    fill: background,
    stroke: background,
    opacity: opacity,
    strokeWidth: 0.0
  })

  this.text(text, x, y-1, {
    color: textcolor,
    backgroundColor: background,
    backgroundPadding: 0.1,
    opacity: opacity,
    font: fontstring
  })
}

RoomVisual.prototype.animatedPosition = function (x, y, opts={}) {

  let color = !!opts.color ? opts.color : 'blue'
  let opacity = !!opts.opacity ? opts.opacity : 0.5
  let radius = !!opts.radius ? opts.radius : 0.75
  let frames = !!opts.frames ? opts.frames : 6


  let angle = (Game.time % frames * 90 / frames) * (Math.PI / 180);
  let s = Math.sin(angle);
  let c = Math.cos(angle);

  let sizeMod = Math.abs(Game.time % frames - frames / 2) / 10;
  radius += radius * sizeMod;

  let points = [
      rotate(0, -radius, s, c, x, y),
      rotate(radius, 0, s, c, x, y),
      rotate(0, radius, s, c, x, y),
      rotate(-radius, 0, s, c, x, y),
      rotate(0, -radius, s, c, x, y),
  ];

  // Logger.highlightData(points)

  return this.poly(points, {stroke: color, opacity: opacity});
}

function rotate(x, y, s, c, px, py) {
  let xDelta = x * c - y * s;
  let yDelta = x * s + y * c;
  return { x: px + xDelta, y: py + yDelta };
}


function relPoly(x,y,poly){
  return poly.map(p=>{
    p[0] += x
    p[1] += y
    return p
  })
}
