class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // Сложение
  add(v) {
    if (v instanceof Vector2D) {
      this.x += v.x;
      this.y += v.y;
    } else {
      this.x += v;
      this.y += v;
    }

    return this;
  }

  // Вычитание
  sub(v) {
    if (v instanceof Vector2D) {
      this.x -= v.x;
      this.y -= v.y;
    } else {
      this.x -= v;
      this.y -= v;
    }

    return this;
  };

  // Умножение
  mult(v) {
    if (v instanceof Vector2D) {
      this.x *= v.x;
      this.y *= v.y;
    } else {
      this.x *= v;
      this.y *= v;
    }

    return this;
  };

  // Деление
  div(v) {
    if (v instanceof Vector2D) {
      if (v.x !== 0 && v.y !== 0) {
        this.x /= v.x;
        this.y /= v.y;
      }
    } else {
      if (v !== 0) {
        this.x /= v;
        this.y /= v;
      }
    }

    return this;
  };

  // Магнитуда (длина) вектора
  mag() {
    return Math.hypot(this.x, this.y);
  };

  // Скалярное произведение двух векторов
  // Если в качестве аргумента передать этот же вектор, то вычислим магнитуду вектора в квадрате. Это быстрее
  // чем считать фвктическую длину, т.к. не нужно брать кв.корень. Бывает полезно, например, в случае сравнения
  // векторов, где не требуется действительная длина вектора
  dot(v) {
    return this.x * v.x + this.y * v.y;
  };

  // Евклидово расстояние (Euclid distance) между двумя точками
  dist(v) {
    return Math.hypot(v.x - this.x, v.y - this.y);
  }

  // Нормализует вектор до длины 1
  // {x: 10, y: 20} 👉 {x: 0.4454354, y: 0.8908708}
  // Полезно, например, когда нужно изменить магнитуду вектора сохранив его направление
  normalize() {
    const len = this.mag();
    if (len !== 0) return this.mult(1 / len);

    return this;
  };

  // Ограничение магнитуды вектора
  limit(max) {
    const mSq = this.dot(this);
    if (mSq > max * max) {
      this.div(Math.sqrt(mSq)).mult(max);
    }

    return this;
  }

  // Установка длины вектора
  setMag(v) {
    return this.normalize().mult(v);
  };

  // Рассчитывает угол поворота вектора в радианах
  heading() {
    return Math.atan2(this.y, this.x);
  }

  // Поворачивает направление вектора на заданный угол
  rotate(angle) {
    const newHeading = this.heading() + angle;
    const mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;

    return this;
  };

  // Считает и возвращает угол (в радианах) меджу двумя векторами
  angleBetween(v) {
    const dotmagmag = this.dot(v) / (this.mag() * v.mag());
    return Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
  }

  // Проверяет равны ли векторы
  equals(v) {
    return this.x === v.x && this.y === v.y;
  };

  // Инвертирует направление вектора
  inverse() {
    return this.div(-this.dot(this));
  };

  // Лень делать static-методы, проще клонировать вектор
  // ❌ newVector = Vector2D.add(v1, v2)
  // ✅ newVector = v1.clone().add(v2);
  clone() {
    return new Vector2D(this.x, this.y);
  }

  // Строковое представление вектора, полезно для логгирования в консоли
  toString() {
    return `Vector2D: {x:${this.x}, y:${this.y}'}`;
  };
}
